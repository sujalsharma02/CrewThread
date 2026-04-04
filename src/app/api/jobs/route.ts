import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };
    if (skill) query.skills = { $in: [new RegExp(skill, "i")] };
    if (type) query.jobType = type;
    if (location) query.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(query)
      .populate("companyId", "name username avatar headline")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments(query);
    return NextResponse.json({ jobs, total, page, hasMore: skip + limit < total });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const job = await Job.create(body);
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
