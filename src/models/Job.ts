import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJob extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  salary: { min: number; max: number; currency: string };
  skills: string[];
  location: string;
  jobType: "full-time" | "part-time" | "internship" | "remote" | "hybrid";
  experienceMin: number;
  experienceMax: number;
  openings: number;
  lastDate: Date;
  applicants: {
    userId: mongoose.Types.ObjectId;
    status: "pending" | "shortlisted" | "rejected" | "accepted";
    appliedAt: Date;
    coverLetter: string;
  }[];
  isActive: boolean;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    skills: [{ type: String }],
    location: { type: String, default: "Remote" },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote", "hybrid"],
      default: "full-time",
    },
    experienceMin: { type: Number, default: 0 },
    experienceMax: { type: Number, default: 5 },
    openings: { type: Number, default: 1 },
    lastDate: { type: Date },
    applicants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "shortlisted", "rejected", "accepted"],
          default: "pending",
        },
        appliedAt: { type: Date, default: Date.now },
        coverLetter: { type: String, default: "" },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);

export default Job;
