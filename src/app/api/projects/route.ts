import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill");
    const status = searchParams.get("status") || "open";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query: any = { status };
    if (skill) query.skills = { $in: [new RegExp(skill, "i")] };

    const projects = await Project.find(query)
      .populate("ownerId", "name username avatar headline")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(query);
    return NextResponse.json({ projects, total, page, hasMore: skip + limit < total });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const project = await Project.create(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
