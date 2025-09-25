import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { issue } = req.body;
    if (!issue) return res.status(400).json({ msg: "Issue is required" });

    const proofPath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const c = await Complaint.create({
      user: req.user._id,
      issue,
      proof: proofPath,
    });

    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

export const myComplaints = async (req, res) => {
  try {
    const list = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
