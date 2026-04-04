import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const job = await Job.findById(params.id)
      .populate("companyId", "name username avatar headline location")
      .lean();
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, coverLetter } = body;

    const job = await Job.findById(params.id);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const alreadyApplied = job.applicants.some(
      (a) => a.userId.toString() === userId
    );
    if (alreadyApplied) {
      return NextResponse.json({ error: "Already applied" }, { status: 409 });
    }

    job.applicants.push({
      userId,
      status: "pending",
      appliedAt: new Date(),
      coverLetter: coverLetter || "",
    });

    await job.save();
    return NextResponse.json({ message: "Applied successfully", job });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}
