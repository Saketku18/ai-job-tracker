const axios = require("axios");
const FormData = require("form-data");

// Base URL for the Python/FastAPI AI Microservice
const getAiBaseUrl = () => {
  return (process.env.AI_SERVICE_URL || "https://ai-job-tracker-s5x2.onrender.com").replace(/\/$/, "");
};

/**
 * Standardized error handler for FastAPI upstream proxy calls
 */
const handleProxyError = (err, res, defaultMsg) => {
  const status = err.response?.status;
  const responseData = err.response?.data;

  let errorMsg = defaultMsg;
  if (typeof responseData === "string") {
    errorMsg = responseData;
  } else if (responseData?.error) {
    errorMsg = responseData.error;
  } else if (responseData?.message) {
    errorMsg = responseData.message;
  } else if (responseData?.detail) {
    errorMsg = typeof responseData.detail === "string" ? responseData.detail : JSON.stringify(responseData.detail);
  } else if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    errorMsg = "AI microservice is currently unreachable. Please verify service availability.";
  } else if (err.code === "ETIMEDOUT" || err.code === "ECONNABORTED") {
    errorMsg = "AI microservice request timed out. Please try again.";
  } else if (err.message) {
    errorMsg = err.message;
  }

  console.error(`[AI Proxy Error] Status: ${status || err.code || "unknown"} - ${errorMsg}`);

  const httpStatus = status && status >= 400 && status < 600 ? status : 502;
  return res.status(httpStatus).json({
    success: false,
    message: errorMsg,
  });
};

// ==========================================
// 1. 🔹 UPLOAD RESUME (PDF)
// ==========================================
const uploadResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No PDF file received. Please upload a valid PDF document.",
      });
    }

    const aiBaseUrl = getAiBaseUrl();
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname || "resume.pdf",
      contentType: req.file.mimetype || "application/pdf",
    });

    const response = await axios.post(`${aiBaseUrl}/upload-resume`, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res, "Resume upload failed");
  }
};

// ==========================================
// 2. 🔹 EXTRACT JOB DETAILS
// ==========================================
const extractJob = async (req, res) => {
  try {
    const jdText = (req.body.text || req.body.job_description || req.body.jd || "").trim();

    if (!jdText) {
      return res.status(400).json({
        success: false,
        message: "Job description text is required",
      });
    }

    const aiBaseUrl = getAiBaseUrl();
    const response = await axios.post(
      `${aiBaseUrl}/extract`,
      {
        text: jdText,
        job_description: jdText,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res, "Failed to extract job details");
  }
};

// ==========================================
// 3. 🔹 MATCH RESUME TO JD
// ==========================================
const matchResume = async (req, res) => {
  try {
    const aiBaseUrl = getAiBaseUrl();
    const jdText = (req.body.text || req.body.job_description || req.body.jd || "").trim();

    let response;
    try {
      response = await axios.post(`${aiBaseUrl}/match`, {}, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });
    } catch (err) {
      // If FastAPI reports job description not extracted yet and JD text was provided in body, extract then retry
      const errMsg = err.response?.data?.error || "";
      if (err.response?.status === 400 && errMsg.includes("Job description not extracted") && jdText) {
        await axios.post(
          `${aiBaseUrl}/extract`,
          { text: jdText, job_description: jdText },
          { headers: { "Content-Type": "application/json" }, timeout: 60000 }
        );
        response = await axios.post(`${aiBaseUrl}/match`, {}, {
          headers: { "Content-Type": "application/json" },
          timeout: 60000,
        });
      } else {
        throw err;
      }
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res, "Failed to calculate resume match");
  }
};

// ==========================================
// 4. 🔹 CAREER ADVICE
// ==========================================
const getAdvice = async (req, res) => {
  try {
    const aiBaseUrl = getAiBaseUrl();
    const jdText = (req.body.text || req.body.job_description || req.body.jd || "").trim();

    let response;
    try {
      response = await axios.post(`${aiBaseUrl}/advise`, {}, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });
    } catch (err) {
      // If FastAPI reports missing job description and JD text was provided in body, extract then retry
      const errMsg = err.response?.data?.error || "";
      if (err.response?.status === 400 && errMsg.includes("Missing resume or job description") && jdText) {
        await axios.post(
          `${aiBaseUrl}/extract`,
          { text: jdText, job_description: jdText },
          { headers: { "Content-Type": "application/json" }, timeout: 60000 }
        );
        response = await axios.post(`${aiBaseUrl}/advise`, {}, {
          headers: { "Content-Type": "application/json" },
          timeout: 60000,
        });
      } else {
        throw err;
      }
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    return handleProxyError(error, res, "Failed to generate career advice");
  }
};

module.exports = {
  uploadResume,
  extractJob,
  matchResume,
  getAdvice,
};