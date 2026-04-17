const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const {
  uploadResume,
  extractJob,
  matchResume,
  getAdvice,
} = require("../controllers/ai.controller");

router.post("/upload", upload.single("file"), uploadResume);
router.post("/extract", extractJob);
router.post("/match", matchResume);
router.post("/advise", getAdvice);

module.exports = router;