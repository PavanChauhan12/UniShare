import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateMe } from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);

// For JSON body updates (name, rollNo, mobile, profilePhoto URL)
router.put("/update", protect, updateMe);

// OPTIONAL: direct profile photo upload
router.post("/upload-photo", protect, upload.single("photo"), async (req, res) => {
  try {
    const url = `/uploads/${req.file.filename}`;
    res.json({ profilePhoto: url });
  } catch (err) {
    res.status(500).json({ msg: "Upload failed" });
  }
});

export default router;
