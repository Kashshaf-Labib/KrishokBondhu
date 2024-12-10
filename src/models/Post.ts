//Post.ts:
import mongoose, { Schema, Document,Types } from "mongoose";

export interface PostDocument extends Document {
  _id: Types.ObjectId;
  userId: string; // Clerk User ID
  username:string; //Clerk username
  title: string;
  description: string;
  imageUrl?: string;
  upvotes: number;
  interestedUsers: string[]; // Clerk User IDs of interested users
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostDocument>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: String, required: true }, // Clerk User ID
    username:{ type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl:{ type: String }, // Optional field for image URL
    upvotes: { type: Number, default: 0 },
    interestedUsers: [{ type: String }], // Array of Clerk User IDs
  },
  { timestamps: true }
);

const Post =mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);
export default Post;
