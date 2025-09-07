// src/app/api/posts/[postId]/upvote/route.ts
import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectDB } from "@/db/config";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;


  if (!postId || postId === "undefined") {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const { increment } = await req.json(); // true = increment, false = decrement

  try {
    await connectDB();

    const update = increment
      ? { $inc: { upvotes: 1 } }
      : { $inc: { upvotes: -1 } };

    const updatedPost = await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ upvotes: updatedPost.upvotes }, { status: 200 });
  } catch (error) {
    console.error("Error updating upvote count:", error);
    return NextResponse.json(
      { error: "Failed to update upvote count" },
      { status: 500 }
    );
  }
}
