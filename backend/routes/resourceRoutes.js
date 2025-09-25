import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addResource, getResources, borrowResource } from "../controllers/ResourceController.js";

const router = express.Router();

router.post("/add", protect, addResource);
router.get("/", protect, getResources);
router.post("/borrow", protect, borrowResource);

export default router;