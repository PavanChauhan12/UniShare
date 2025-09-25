import Resource from "../models/Resource.js";
import BorrowRequest from "../models/BorrowRequest.js";

// OWNER: create a resource listing
export const createResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) return res.status(400).json({ msg: "Title and category are required" });

    const resource = await Resource.create({
      title,
      description,
      category,
      owner: req.user._id,
      available: true,
    });

    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// List available resources (for browsing)
export const listAvailable = async (_req, res) => {
  try {
    const items = await Resource.find({ available: true }).populate("owner", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// USER: request to borrow a resource
export const requestBorrow = async (req, res) => {
  try {
    const { resourceId, days } = req.body;
    if (!resourceId || !days) return res.status(400).json({ msg: "resourceId and days are required" });

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ msg: "Resource not found" });

    if (String(resource.owner) === String(req.user._id)) {
      return res.status(400).json({ msg: "You cannot request your own resource" });
    }

    // If currently unavailable (already borrowed), block requesting
    if (!resource.available) {
      return res.status(400).json({ msg: "Resource is currently borrowed" });
    }

    const alreadyPending = await BorrowRequest.findOne({
      resource: resourceId,
      requester: req.user._id,
      status: "pending",
    });

    if (alreadyPending) return res.status(400).json({ msg: "You already have a pending request for this resource" });

    const br = await BorrowRequest.create({
      resource: resourceId,
      requester: req.user._id,
      lender: resource.owner,
      days,
      status: "pending",
    });

    res.json(br);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// LENDER: approve a request
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const br = await BorrowRequest.findById(requestId).populate("resource");
    if (!br) return res.status(404).json({ msg: "Request not found" });
    if (String(br.lender) !== String(req.user._id)) return res.status(403).json({ msg: "Not authorized" });
    if (br.status !== "pending") return res.status(400).json({ msg: "Request is not pending" });

    const resource = await Resource.findById(br.resource._id);
    if (!resource.available) return res.status(400).json({ msg: "Resource is already borrowed" });

    // Approve → mark resource borrowed
    resource.available = false;
    resource.borrower = br.requester;
    resource.startDate = new Date();
    resource.endDate = new Date(Date.now() + br.days * 24 * 60 * 60 * 1000);
    await resource.save();

    br.status = "approved";
    await br.save();

    res.json({ msg: "Approved", request: br, resource });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// LENDER: deny a request
export const denyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const br = await BorrowRequest.findById(requestId);
    if (!br) return res.status(404).json({ msg: "Request not found" });
    if (String(br.lender) !== String(req.user._id)) return res.status(403).json({ msg: "Not authorized" });
    if (br.status !== "pending") return res.status(400).json({ msg: "Request is not pending" });

    br.status = "denied";
    await br.save();

    res.json({ msg: "Denied", request: br });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// LENDER: mark as returned (verify return)
export const markReturned = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ msg: "Resource not found" });
    if (String(resource.owner) !== String(req.user._id)) return res.status(403).json({ msg: "Not authorized" });

    // Reset borrowing fields
    resource.available = true;
    resource.borrower = null;
    resource.startDate = null;
    resource.endDate = null;
    await resource.save();

    res.json({ msg: "Marked as returned", resource });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DASHBOARD QUERIES

// 1) Resources owned by user
export const myOwnedResources = async (req, res) => {
  try {
    const items = await Resource.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 2) Resources currently borrowed by user
export const myBorrowedResources = async (req, res) => {
  try {
    const items = await Resource.find({ borrower: req.user._id, available: false }).populate("owner", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3) Borrow requests made by user (pending/denied/approved history)
export const myBorrowRequests = async (req, res) => {
  try {
    const reqs = await BorrowRequest.find({ requester: req.user._id })
      .sort({ createdAt: -1 })
      .populate("resource", "title category owner")
      .populate("lender", "name email");
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 4) Incoming requests for user's resources (for owner to review)
export const incomingRequests = async (req, res) => {
  try {
    const reqs = await BorrowRequest.find({ lender: req.user._id, status: "pending" })
      .sort({ createdAt: -1 })
      .populate("resource", "title category")
      .populate("requester", "name email");
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
