// Advice.ts:
import mongoose, { Schema, Document } from "mongoose";
import "./Post";

export interface AdviceDocument extends Document {
  postId: mongoose.Schema.Types.ObjectId; // Reference to the Post model
  expertId: string; // Clerk User ID of the expert
  expertName: string;
  content: string; // The advice content
  createdAt: Date;
  updatedAt: Date;
}

const AdviceSchema = new Schema<AdviceDocument>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Post reference
    expertId: { type: String, required: true }, // Clerk User ID
    expertName: { type: String, required: true }, //Clerk username
    content: { type: String, required: true, trim: true }, // Advice content
  },
  { timestamps: true }
);

const Advice =
  mongoose.models.Advice ||
  mongoose.model<AdviceDocument>("Advice", AdviceSchema);
export default Advice;
