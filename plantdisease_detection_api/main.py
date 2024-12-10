from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from io import BytesIO
from PIL import Image
import uvicorn

app = FastAPI()

# Allow all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # You can specify a list of origins, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Load the model
MODEL = tf.keras.models.load_model("./model/2.keras")

# Define class names
CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
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
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy",
]


# Helper function to read file as image
def read_file_as_image(data) -> np.ndarray:
    image = np.array(
        Image.open(BytesIO(data)).convert("RGB")
    )  # Ensure image is in RGB format
    return image


# Health check route
@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}


# Prediction route
@app.post("/predict")
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

    return {"class": predicted_class, "confidence": float(confidence)}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
