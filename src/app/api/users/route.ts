import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const role = searchParams.get("role");

    const query: any = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { headline: { $regex: q, $options: "i" } },
        { skills: { $in: [new RegExp(q, "i")] } },
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select("name username avatar headline skills location role availability")
      .limit(20)
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const existing = await User.findOne({ $or: [{ email: body.email }, { username: body.username }] });
    if (existing) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    const user = await User.create(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
