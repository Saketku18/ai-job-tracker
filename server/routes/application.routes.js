const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

// CREATE
router.post("/", protect, createApplication);

// GET ALL (User isolated)
router.get("/", protect, getApplications);

// GET SINGLE (User isolated with ownership check)
router.get("/:id", protect, getApplicationById);

// UPDATE (User isolated with ownership check)
router.put("/:id", protect, updateApplication);

// DELETE (User isolated with ownership check)
router.delete("/:id", protect, deleteApplication);

module.exports = router;