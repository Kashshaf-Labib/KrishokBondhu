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
from pydantic import BaseModel, Field
import pickle
from datetime import datetime, timedelta

# app/services.py
from langchain_groq import ChatGroq

load_dotenv()  # Load environment variables from .env


# Initialize the ChatGroq client
def get_llm_response(query: str) -> str:
    response = llm.invoke(query)
    return response.content


class QueryRequest(BaseModel):
    query: str = Field(..., example="Give me prevention methods for tomato mosaic disease")


class QueryResponse(BaseModel):
    content: str


class Settings:
    groq_api_key: str = os.getenv("GROQ_API_KEY")
    model_name: str = os.getenv("MODEL_NAME", "llama-3.1-70b-versatile")
    temperature: float = float(os.getenv("TEMPERATURE", 0))
    max_tokens: int = int(os.getenv("MAX_TOKENS", 1000))
    timeout: int = int(os.getenv("TIMEOUT", 30))
    max_retries: int = int(os.getenv("MAX_RETRIES", 2))


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
MODEL = tf.keras.models.load_model("./model/1.keras")
model_path = "./model/RandomForest.pkl"
try:
    with open(model_path, "rb") as file:
        crop_model = pickle.load(file)
except FileNotFoundError:
    logger.error(f"Error: Crop prediction model not found at {model_path}")
    crop_model = None

fertilizer_model_path = "./model/fertilizerRecommendation.keras"
try:
    FERTILIZER_MODEL = tf.keras.models.load_model(fertilizer_model_path)
    logger.info("Fertilizer recommendation model loaded successfully")
except Exception as e:
    logger.error(f"Error loading fertilizer model: {e}")
    FERTILIZER_MODEL = None

class FertilizerRecommendationRequest(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: int  # Encoded as integer
    crop_type: int  # Encoded as integer
    nitrogen: float
    potassium: float
    phosphorous: float

class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

fertilizer_mapping = {
    0: "10-10-10",
    1: "10-26-26",
    2: "14-14-14",
    3: "14-35-14",
    4: "15-15-15",
    5: "17-17-17",
    6: "20-20",
    7: "28-28",
    8: "DAP",
    9: "Potassium chloride",
    10: "Potassium sulfate",
    11: "Superphosphate",
    12: "TSP",
    13: "Urea"
}

# Define class names
CLASS_NAMES = [
    "Pepper_bell__Bacterial_spot",
    "Pepper_bell__healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato_Tomato_YellowLeaf_Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy",
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
@app.post("/disease-detection")
async def predict(file: UploadFile = File(...)):
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
        "confidence": float(confidence),
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

@app.post("/recommendfertilizer")
async def recommend_fertilizer(data: FertilizerRecommendationRequest):
    if FERTILIZER_MODEL is None:
        raise HTTPException(status_code=503, detail="Fertilizer recommendation model is not available")

    # Convert input data into NumPy array
    input_data = np.array([[data.temperature, data.humidity, data.moisture,
                            data.soil_type, data.crop_type, data.nitrogen,
                            data.potassium, data.phosphorous]])

    # Ensure input type is float32 (as required by TensorFlow)
    input_data = input_data.astype(np.float32)

    # Make prediction
    prediction = FERTILIZER_MODEL.predict(input_data)
    predicted_fertilizer_index = np.argmax(prediction[0])  # Get index of max confidence class

    # Map index to fertilizer name
    predicted_fertilizer = fertilizer_mapping.get(predicted_fertilizer_index, "Unknown")

    return {
        "fertilizer": predicted_fertilizer,
        "confidence": float(np.max(prediction[0])),
    }
@app.post("/recommendcrop")
async def predict_crop(data: CropPredictionRequest):
    if crop_model is None:
        raise HTTPException(status_code=503, detail="Crop prediction model is not available")
    input_data = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])
    prediction = crop_model.predict(input_data)
    return {"prediction": prediction[0]}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
