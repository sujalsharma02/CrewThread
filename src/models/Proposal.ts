import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProposal extends Document {
  projectId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  price: number;
  deliveryTime: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const ProposalSchema = new Schema<IProposal>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Proposal: Model<IProposal> =
  mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema);

export default Proposal;
