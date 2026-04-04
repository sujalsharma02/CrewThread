import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("authorId", "name username avatar headline role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();

    return NextResponse.json({ posts, total, page, hasMore: skip + limit < total });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { authorId, content, type, media, tags } = body;

    if (!authorId || !content) {
      return NextResponse.json({ error: "authorId and content are required" }, { status: 400 });
    }

    const post = await Post.create({ authorId, content, type: type || "normal", media: media || [], tags: tags || [] });
    const populated = await post.populate("authorId", "name username avatar headline role");

    return NextResponse.json({ post: populated }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
