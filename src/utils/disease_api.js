//src/utils/disease_api.js:
import axios from 'axios';

export async function predictDisease(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post('http://localhost:8000/disease-detection', formData, {
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


