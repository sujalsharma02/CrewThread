import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  role: "jobseeker" | "company";
  avatar: string;
  coverPhoto: string;
  headline: string;
  bio: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  portfolioLinks: string[];
  githubLink: string;
  linkedinLink: string;
  location: string;
  availability: "open_to_work" | "freelance" | "not_available";
  resumeUrl: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["jobseeker", "company"], default: "jobseeker" },
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    portfolioLinks: [{ type: String }],
    githubLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" },
    location: { type: String, default: "" },
    availability: {
      type: String,
      enum: ["open_to_work", "freelance", "not_available"],
      default: "not_available",
    },
    resumeUrl: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
