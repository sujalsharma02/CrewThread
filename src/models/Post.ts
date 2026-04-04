import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  authorModel: "User";
  type: "normal" | "job" | "project" | "event";
  content: string;
  media: string[];
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  reposts: mongoose.Types.ObjectId[];
  jobRef?: mongoose.Types.ObjectId;
  projectRef?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorModel: { type: String, enum: ["User"], default: "User" },
    type: {
      type: String,
      enum: ["normal", "job", "project", "event"],
      default: "normal",
    },
    content: { type: String, required: true },
    media: [{ type: String }],
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reposts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    jobRef: { type: Schema.Types.ObjectId, ref: "Job" },
    projectRef: { type: Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
