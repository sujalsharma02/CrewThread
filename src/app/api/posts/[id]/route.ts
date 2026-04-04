import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Post.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, userId } = body;

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (action === "like") {
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(index, 1);
      }
    } else if (action === "comment") {
      post.comments.push({ userId, content: body.content, createdAt: new Date() });
    } else if (action === "repost") {
      const index = post.reposts.indexOf(userId);
      if (index === -1) {
        post.reposts.push(userId);
      } else {
        post.reposts.splice(index, 1);
      }
    }

    await post.save();
    return NextResponse.json({ post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
