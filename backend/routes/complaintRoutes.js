import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createComplaint, myComplaints } from "../controllers/complaintController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("proof"), createComplaint);
router.get("/my", protect, myComplaints);

export default router;
