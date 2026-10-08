const Application = require("../models/Application");

// 🔹 CREATE APPLICATION
const createApplication = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { company, role, location, status, skills } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    // Enforce authenticated user ID; never trust client-supplied userId
    const newApp = new Application({
      company,
      role,
      location: location || "",
      status: status || "applied",
      skills: Array.isArray(skills) ? skills : [],
      userId: req.user._id,
    });

    const saved = await newApp.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET ALL APPLICATIONS (for authenticated user only)
const getApplications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Return ONLY applications belonging to the authenticated user
    const apps = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET SINGLE APPLICATION (with ownership verification)
const getApplicationById = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this application" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE APPLICATION (with ownership verification)
const updateApplication = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only allow the authenticated owner to update
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    const { company, role, location, status, skills } = req.body;

    if (company !== undefined) application.company = company;
    if (role !== undefined) application.role = role;
    if (location !== undefined) application.location = location;
    if (status !== undefined) application.status = status;
    if (skills !== undefined) application.skills = Array.isArray(skills) ? skills : application.skills;

    const updated = await application.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 DELETE APPLICATION (with ownership verification)
const deleteApplication = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only allow the authenticated owner to delete
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this application" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};