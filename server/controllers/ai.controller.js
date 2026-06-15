const axios = require("axios");
const FormData = require("form-data");

// 🔹 Upload Resume
const uploadResume = async (req, res) => {
  try {
    console.log("FILE RECEIVED:", !!req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, "resume.pdf");

    const response = await axios.post(
      "https://ai-job-tracker-s5x2.onrender.com/upload-resume",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("UPLOAD ERROR:", error.response?.data);
    console.error("MESSAGE:", error.message);

    res.status(500).json({
      message: error.response?.data || error.message,
    });
  }
};

// 🔹 Extract Job
const extractJob = async (req, res) => {
  try {
    const response = await axios.post(
      "https://ai-job-tracker-s5x2.onrender.com/extract",
      { job_description: req.body.text }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Match Resume
const matchResume = async (req, res) => {
  try {
    const response = await axios.post(
      "https://ai-job-tracker-s5x2.onrender.com/match"
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Advice
const getAdvice = async (req, res) => {
  try {
    const response = await axios.post(
      "https://ai-job-tracker-s5x2.onrender.com/advise"
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  extractJob,
  matchResume,
  getAdvice,
};