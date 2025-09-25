// Profile: get & update (email + credibility are non-editable)
import User from "../models/User.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowed = ["name", "rollNo", "mobile", "profilePhoto"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    // Prevent editing email/credibility via this route
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// If you want to support profilePhoto upload via multipart, you can create a dedicated route that uses multer and sets profilePhoto to req.file.path
