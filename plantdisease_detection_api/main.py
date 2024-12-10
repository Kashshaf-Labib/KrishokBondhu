from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from io import BytesIO
from PIL import Image
import uvicorn
import logging
import os
from dotenv import load_dotenv
import requests
load_dotenv()  # Load environment variables from .env
from pydantic import BaseModel, Field
import pickle
from datetime import datetime,timedelta

# app/services.py
from langchain_groq import ChatGroq


# Initialize the ChatGroq client


def get_llm_response(query: str) -> str:
    response = llm.invoke(query)
    return response.content


class QueryRequest(BaseModel):
    query: str = Field(..., example="Give me prevention methods for tomato mosaic disease")

class QueryResponse(BaseModel):
    content: str

class Settings:
    groq_api_key: str = os.getenv('GROQ_API_KEY')
    model_name: str = os.getenv('MODEL_NAME', 'llama-3.1-70b-versatile')
    temperature: float = float(os.getenv('TEMPERATURE', 0))
    max_tokens: int = int(os.getenv('MAX_TOKENS', 1000))
    timeout: int = int(os.getenv('TIMEOUT', 30))
    max_retries: int = int(os.getenv('MAX_RETRIES', 2))

settings = Settings()

llm = ChatGroq(
    model=settings.model_name,
    temperature=settings.temperature,
    groq_api_key=settings.groq_api_key,
    max_tokens=settings.max_tokens,
    timeout=settings.timeout,
    max_retries=settings.max_retries,
    # Add other parameters if needed
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()



# Allow all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify a list of origins, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Load the model
MODEL = tf.keras.models.load_model('./model/1.keras')
model_path = "./model/RandomForest.pkl"
try:
    with open(model_path, 'rb') as file:
        crop_model = pickle.load(file)
except FileNotFoundError:
    logger.error(f"Error: Crop prediction model not found at {model_path}")
    crop_model = None
class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class Location(BaseModel):
    lon: float
    lat: float



# Define class names
CLASS_NAMES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

# Helper function to read file as image
def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)).convert("RGB"))  # Ensure image is in RGB format
    return image

# Health check route
@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

# Prediction route
@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    # Read and preprocess image
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image, 0)  # Expand dimensions for batch processing

    # Make prediction
    prediction = MODEL.predict(image_batch)
    predicted_class_index = np.argmax(prediction[0])
    confidence = np.max(prediction[0])

    # Get class label
    predicted_class = CLASS_NAMES[predicted_class_index]

    return {
        "class": predicted_class,
        "confidence": float(confidence)
    }

@app.post("/query", response_model=QueryResponse)
def query_llm(request: QueryRequest):
    logger.info(f"Received query: {request.query}")
    try:
        content = get_llm_response(request.query)
        logger.info(f"Response: {content}")
        return QueryResponse(content=content)
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

   


    try:
        end_date = datetime.now().strftime('%Y%m%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y%m%d')
        
        weather_data = get_nasa_power_data(location.lat, location.lon, start_date, end_date)
        if weather_data:
            # Retrieve and process the relevant weather data
            avg_temp = safe_average(weather_data.get('T2M', {}))
            avg_humidity = safe_average(weather_data.get('RH2M', {}))
            avg_rainfall = safe_average(weather_data.get('PRECTOTCORR', {}))
            
            if avg_temp is not None and avg_humidity is not None and avg_rainfall is not None:
                return {
                    "avg_temperature": round(avg_temp, 2),
                    "avg_humidity": round(avg_humidity, 2),
                    "avg_rainfall": round(avg_rainfall, 2)
                }
            else:
                logger.error(f"Invalid data in NASA POWER response: {weather_data}")
                raise HTTPException(status_code=500, detail="Invalid data received from NASA POWER")
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch NASA POWER data")
    except Exception as e:
        logger.error(f"Error in get_nasa_weather_averages: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/recommedcrop")
async def predict_crop(data: CropPredictionRequest):
    if crop_model is None:
        raise HTTPException(status_code=503, detail="Crop prediction model is not available")
    input_data = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])
    prediction = crop_model.predict(input_data)
    return {"prediction": prediction[0]}



if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
