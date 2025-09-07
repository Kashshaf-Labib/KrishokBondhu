//src/utils/disease_api.js:
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://krishok-bondhu-backend-1.onrender.com";

export async function predictDisease(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/disease-detection`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Prediction error:", error);
        return null;
    }
}


