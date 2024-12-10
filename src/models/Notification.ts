//Notification.ts:
import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  userId: string; // Clerk User ID
  post: mongoose.Types.ObjectId; // Associated post
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: String, required: true }, // Clerk User ID
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default Notification;

