import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  skills: string[];
  attachments: string[];
  pricingType: "fixed" | "hourly";
  status: "open" | "in_progress" | "completed" | "cancelled";
  proposals: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date },
    skills: [{ type: String }],
    attachments: [{ type: String }],
    pricingType: { type: String, enum: ["fixed", "hourly"], default: "fixed" },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    proposals: [{ type: Schema.Types.ObjectId, ref: "Proposal" }],
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
