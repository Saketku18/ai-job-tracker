const axios = require("axios");
const FormData = require("form-data");

// 🔹 Upload Resume
const uploadResume = async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, "resume.pdf");

    const response = await axios.post(
      "http://localhost:8000/upload-resume",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Extract Job
const extractJob = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/extract",
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
      "http://localhost:8000/match"
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
      "http://localhost:8000/advise"
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