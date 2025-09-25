import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String }, // editable by user
    profilePhoto: { type: String }, // URL to /uploads/...
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    credibility: { type: Number, default: 0 }, // non-editable at UI
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
