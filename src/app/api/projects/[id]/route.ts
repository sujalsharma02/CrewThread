import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Proposal from "@/models/Proposal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const project = await Project.findById(params.id)
      .populate("ownerId", "name username avatar headline location")
      .populate({ path: "proposals", populate: { path: "freelancerId", select: "name username avatar headline" } })
      .lean();
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { freelancerId, price, deliveryTime, message } = body;

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const proposal = await Proposal.create({ projectId: params.id, freelancerId, price, deliveryTime, message });
    project.proposals.push(proposal._id);
    await project.save();

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit proposal" }, { status: 500 });
  }
}
