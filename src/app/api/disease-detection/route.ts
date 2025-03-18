//src/app/api/disease-detection/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import {connectDB} from "@/db/config";
import Prediction from "@/models/Prediction";
import { predictDisease } from "@/utils/disease_api"; // Import the prediction function
import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";
import streamifier from "streamifier";

connectDB();

export const POST = async (req: Request) => {
  try {
    // const {userId} = await auth();
    // console.log(userId);
    // if (!userId)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    if (!file)
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );

    // Convert file to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload Buffer to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "disease_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    // Call disease detection function
    const prediction = await predictDisease(file);
    if (!prediction)
      return NextResponse.json(
        { message: "Prediction failed" },
        { status: 500 }
      );

    // Store prediction in MongoDB
    const newPrediction = new Prediction({
      userId: "12343453",
      imageUrl: (uploadResult as any).secure_url,
      disease: prediction.class,
      confidence: prediction.confidence * 100,
    });

    await newPrediction.save();

    return NextResponse.json(
      { success: true, data: newPrediction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in prediction route:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
