//src/app/api/posts/[postId]/advices/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Clerk API for user details
import mongoose from "mongoose";
import Advice from "@/models/Advice"; // Import Advice model
import Post from "@/models/Post";
import { connectDB } from "@/db/config";
import { pusher } from "@/utils/pusher"; // Import Pusher instance

// Connect to the database
connectDB();

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const advices = await Advice.find({ postId }).sort({ createdAt: -1 });
    return NextResponse.json(advices, { status: 200 });
  } catch (error) {
    console.error("Error fetching advices:", error);
    return NextResponse.json(
      { error: "Failed to fetch advices" },
      { status: 500 }
    );
  }
}

// export async function POST(
//   request: Request,
//   { params }: { params: { postId: string } }
// ) {
//   const { postId } = params;

//   if (!mongoose.Types.ObjectId.isValid(postId)) {
//     return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
//   }

//   try {
//     const user = await currentUser(); // Retrieve the current user using Clerk

//     if (!user || user.publicMetadata.role !== "expert") {
//       return NextResponse.json(
//         { error: "Unauthorized or not an expert" },
//         { status: 403 }
//       );
//     }

//     const { content } = await request.json();

//     if (!content || content.trim().length === 0) {
//       return NextResponse.json(
//         { error: "Content cannot be empty" },
//         { status: 400 }
//       );
//     }

//     const newAdvice = new Advice({
//       postId,
//       expertId: user.id, // Use Clerk user ID
//       expertName: user.username || "Unknown Expert", // Save the expert's username
//       content,
//     });

//     await newAdvice.save();

//     return NextResponse.json(newAdvice, { status: 201 });
//   } catch (error) {
//     console.error("Error adding advice:", error);
//     return NextResponse.json(
//       { error: "Failed to add advice" },
//       { status: 500 }
//     );
//   }
// }




export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const user = await currentUser(); // Retrieve the current user using Clerk

    if (!user || user.publicMetadata.role !== "expert") {
      return NextResponse.json(
        { error: "Unauthorized or not an expert" },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Create a new advice
    const newAdvice = new Advice({
      postId,
      expertId: user.id, // Use Clerk user ID
      expertName: user.username || "Unknown Expert", // Save the expert's username
      content,
    });

    await newAdvice.save();

    // Fetch the post to get the owner's userId
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postOwnerId = post.userId;

    // Send a notification via Pusher
    await pusher.trigger(`user-${postOwnerId}`, "new-advice", {
      postId,
      expertName: user.username || "Unknown Expert",
      content,
      createdAt: newAdvice.createdAt,
    });

    return NextResponse.json(newAdvice, { status: 201 });
  } catch (error) {
    console.error("Error adding advice:", error);
    return NextResponse.json(
      { error: "Failed to add advice" },
      { status: 500 }
    );
  }
}
