import Resource from "../models/Resource.js";

// Add new resource
export const addResource = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const resource = new Resource({
      title,
      description,
      category,
      owner: req.user
    });
    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get all available resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ available: true }).populate("owner", "name email");
    res.json(resources);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Request to borrow
export const borrowResource = async (req, res) => {
  try {
    const { resourceId, days } = req.body;
    const resource = await Resource.findById(resourceId);
    if (!resource || !resource.available) {
      return res.status(400).json({ msg: "Resource not available" });
    }

    resource.available = false;
    resource.borrower = req.user;
    resource.startDate = new Date();
    resource.endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await resource.save();
    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};