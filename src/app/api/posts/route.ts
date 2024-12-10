// src/app/api/posts/route.ts
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/db/config";
import Post from "@/models/Post";
import cloudinary from "@/utils/cloudinary";
import streamifier from "streamifier";

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch posts, sorted by newest first
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const userId = formData.get("userId") as string;
    const username = formData.get("username") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Validate required fields
    if (!userId || !username || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = "";

    // If an image file is uploaded, upload it to Cloudinary
    if (file) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "post_images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });

      imageUrl = (uploadResult as any).secure_url; // Cloudinary's URL for the uploaded image
    }

    // Create a new post
    const newPost = new Post({
      _id: new mongoose.Types.ObjectId(),
      userId,
      username,
      title,
      description,
      imageUrl,
      upvotes: 0,
      interestedUsers: [],
    });

    // Save to the database
    const savedPost = await newPost.save();

    // Return the created post
    return NextResponse.json(
      {
        ...savedPost.toObject(),
        _id: savedPost._id.toString(), // Convert ObjectId to string
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
}
