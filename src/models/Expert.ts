//Expert.ts:
import mongoose, { Schema, Document } from "mongoose";

export interface ExpertDocument extends Document {
  name: string;
  email: string;
  password: string; // For authentication (hashed)
  createdAt: Date;
}

const ExpertSchema = new Schema<ExpertDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use bcrypt for hashing
  },
  { timestamps: true }
);

const Expert =
  mongoose.models.Expert ||
  mongoose.model<ExpertDocument>("Expert", ExpertSchema);

  export default Expert;
