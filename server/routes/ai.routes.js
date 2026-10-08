const express = require("express");
const router = express.Router();
const multer = require("multer");

const { optionalAuth } = require("../middleware/auth.middleware");

const upload = multer();

const {
  uploadResume,
  extractJob,
  matchResume,
  getAdvice,
} = require("../controllers/ai.controller");

router.post("/upload", optionalAuth, upload.single("file"), uploadResume);
router.post("/extract", optionalAuth, extractJob);
router.post("/match", optionalAuth, matchResume);
router.post("/advise", optionalAuth, getAdvice);

module.exports = router;