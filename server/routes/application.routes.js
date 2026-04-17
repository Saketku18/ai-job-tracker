const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

// CREATE
router.post("/",protect, createApplication);

// GET ALL
router.get("/",protect, getApplications);

// UPDATE
router.put("/:id",protect, updateApplication);

// DELETE
router.delete("/:id",protect, deleteApplication);

module.exports = router;