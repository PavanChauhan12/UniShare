import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["book", "notes", "device", "equipment", "other"],
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Active borrow (set when a request is approved)
    available: { type: Boolean, default: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", resourceSchema);

