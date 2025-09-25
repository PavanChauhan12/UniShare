import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResource,
  listAvailable,
  requestBorrow,
  approveRequest,
  denyRequest,
  markReturned,
  myOwnedResources,
  myBorrowedResources,
  myBorrowRequests,
  incomingRequests,
} from "../controllers/resourceController.js";

const router = express.Router();

// Browse
router.get("/available", protect, listAvailable);

// Owner: create listing
router.post("/", protect, createResource);

// Borrow flow
router.post("/request", protect, requestBorrow); // body: { resourceId, days }
router.post("/requests/:requestId/approve", protect, approveRequest);
router.post("/requests/:requestId/deny", protect, denyRequest);

// Return (by lender/owner)
router.post("/:resourceId/return", protect, markReturned);

// Dashboard queries
router.get("/owned", protect, myOwnedResources);
router.get("/borrowed", protect, myBorrowedResources);
router.get("/requests", protect, myBorrowRequests);
router.get("/incoming", protect, incomingRequests);

export default router;
