import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    await connectDB();
    const user = await User.findOne({ username: params.username })
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { username: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const user = await User.findOneAndUpdate(
      { username: params.username },
      { $set: body },
      { new: true }
    );
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
