//Prediction.ts
import mongoose, { Document, Schema } from "mongoose";

interface IPrediction extends Document {
  userId: string; // Clerk userId
  imageUrl: string;
  disease: string;
  confidence: number;
  createdAt: Date;
}

const PredictionSchema = new Schema<IPrediction>({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  disease: { type: String, required: true },
  confidence: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Prediction =
  mongoose.models.Prediction ||
  mongoose.model<IPrediction>("Prediction", PredictionSchema);
export default Prediction;
