//Chat.ts:
import mongoose, { Schema, Document } from "mongoose";

export interface ChatDocument extends Document {
  farmer: string; // Clerk User ID
  expert: mongoose.Types.ObjectId; // Expert reference (manual management)
  messages: {
    sender: string; // Clerk User ID or Expert ID
    content: string;
    timestamp: Date;
  }[];
}

const ChatSchema = new Schema<ChatDocument>(
  {
    farmer: { type: String, required: true }, // Clerk User ID
    expert: { type: Schema.Types.ObjectId, ref: "Expert", required: true },
    messages: [
      {
        sender: { type: String, required: true }, // Clerk User ID or Expert ID
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat =
  mongoose.models.Chat || mongoose.model<ChatDocument>("Chat", ChatSchema);

export default Chat;
