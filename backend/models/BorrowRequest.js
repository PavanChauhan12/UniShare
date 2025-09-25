import mongoose from "mongoose";

const borrowRequestSchema = new mongoose.Schema(
  {
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    days: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
    // optional planned dates (start when approved)
    requestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("BorrowRequest", borrowRequestSchema);
