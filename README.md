# KrishokBondhu - Agricultural Assistant Platform

KrishokBondhu is a comprehensive agricultural assistance platform that helps farmers with crop recommendations, fertilizer suggestions, and plant disease detection.

## Features

- **Plant Disease Detection**: Upload plant leaf images to detect diseases
- **Fertilizer Recommendation**: Get personalized fertilizer recommendations based on soil conditions
- **Crop Recommendation**: Receive suggestions for suitable crops based on soil and weather conditions
- **AI-Powered Chatbot**: Agricultural assistance chatbot in Bengali language

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **AI/ML**: TensorFlow, scikit-learn
- **Authentication**: Clerk
- **Cloud Services**: Cloudinary (image storage)

## Machine Learning Models

This project uses machine learning models trained on the following datasets:

1. **Plant Disease Detection Model**

   - Based on [Plant Disease Detection Notebook](https://www.kaggle.com/code/babykamal/plant-disease-detection-ipynb)
   - Detects various plant diseases from leaf images
   - Supports multiple crops including tomato, potato, and pepper

2. **Fertilizer Recommendation Model**
   - Based on [Fertilizer Recommendation Notebook](https://www.kaggle.com/code/babykamal/fertilizer-recommendation)
   - Provides fertilizer suggestions based on soil composition
   - Takes into account NPK values and other soil parameters

## Data Sources

1. **Plant Disease Dataset**

   - Based on [Plant Disease Detection Notebook](https://www.kaggle.com/code/babykamal/plant-disease-detection-ipynb)
   - Contains images of various plant diseases across different crops

2. **Fertilizer Recommendation Dataset**

   - Based on [Fertilizer Recommendation Notebook](https://www.kaggle.com/code/babykamal/fertilizer-recommendation)
   - Includes soil characteristics and corresponding fertilizer recommendations

3. **Bangladesh Soil Data**
   - Based on [Fertilizer Recommendation Guide 2018](https://moa.portal.gov.bd/sites/default/files/files/moa.portal.gov.bd/page/9d1b92d4_1793_43af_9425_0ed49f27b8d0/FRG-2018%20%28English%29.pdf)
   - Contains area-wise soil composition data for Bangladesh including:
     - Nitrogen (N) levels
     - Phosphorus (P) levels
     - Potasium(K) levels
     - pH values
   - Data integrated into MongoDB for region-specific recommendations

## Database Schema

The MongoDB database includes collections for:

- User profiles
- Disease predictions
- Area-specific soil data from FRG 2018
- Fertilizer recommendations
- Crop recommendations

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/krishokbondhu.git
cd krishokbondhu
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Start the FastAPI backend:

```bash
cd plantdisease_detection_api
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

- `/disease-detection`: Plant disease detection endpoint
- `/fertilizer`: Fertilizer recommendation endpoint
- `/crop`: Crop recommendation endpoint
- `/message`: Chatbot interaction endpoint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Plant Disease Detection model based on work by [babykamal on Kaggle](https://www.kaggle.com/code/babykamal/plant-disease-detection-ipynb)
- Fertilizer Recommendation model based on work by [babykamal on Kaggle](https://www.kaggle.com/code/babykamal/fertilizer-recommendation)
- [Next.js](https://nextjs.org) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
