const axios = require("axios");
const pdf = require("pdf-parse");
const User = require("../models/User");

// Memory cache for session state (works across authenticated and unauthenticated sessions)
const memoryStore = new Map();

const getSessionKey = (req) => {
  if (req.user?._id) return `user_${req.user._id}`;
  const authHeader = req.headers.authorization;
  if (authHeader) return `token_${authHeader.slice(-16)}`;
  return `ip_${req.ip || "default"}`;
};

const getApiKey = () => {
  return (process.env.GROQ_API_KEY || "").replace(/"/g, "").trim();
};

const PRIMARY_MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODEL = "qwen/qwen3.8-27b";

/**
 * Safely parse JSON from LLM text response (handles code blocks, whitespace, prefix/suffix text)
 */
const cleanAndParseJson = (rawContent) => {
  if (!rawContent || typeof rawContent !== "string") {
    throw new Error("Empty response received from AI model");
  }

  let text = rawContent.trim();

  // Strip markdown code fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  try {
    return JSON.parse(text);
  } catch (err1) {
    // Attempt extracting the first JSON object using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err2) {
        console.error("Regex JSON parse failed. Raw text:", text);
      }
    }
    throw new Error(`Failed to parse AI output as valid JSON: ${err1.message}`);
  }
};

/**
 * Call Groq chat completions API with primary and fallback models
 */
const callGroq = async (messages, model = PRIMARY_MODEL) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not configured on the server");
    error.status = 500;
    throw error;
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages,
        temperature: 0,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content;
    return cleanAndParseJson(raw);
  } catch (err) {
    const status = err.response?.status;
    const providerMsg = err.response?.data?.error?.message;

    if (status === 429) {
      const error = new Error("External AI provider rate/quota limit reached. Please try again shortly.");
      error.status = 429;
      throw error;
    }

    if (status === 401) {
      const error = new Error("External AI provider authentication failed. Check GROQ_API_KEY.");
      error.status = 500;
      throw error;
    }

    if (status === 403) {
      const error = new Error("External AI provider access forbidden.");
      error.status = 403;
      throw error;
    }

    // Try fallback model once if primary model failed with unexpected error
    if (model === PRIMARY_MODEL) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed (${providerMsg || err.message}). Retrying with ${FALLBACK_MODEL}...`);
      return callGroq(messages, FALLBACK_MODEL);
    }

    const error = new Error(providerMsg || err.message || "Failed to process AI request");
    error.status = status && status >= 400 && status < 600 ? status : 502;
    throw error;
  }
};

// ==========================================
// 1. 🔹 UPLOAD RESUME (PDF)
// ==========================================
const uploadResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No PDF file received. Please upload a valid PDF document." });
    }

    let resumeText = "";
    try {
     const parsed = await pdf(req.file.buffer);
     resumeText = parsed?.text ? parsed.text.trim() : "";
    } catch (parseErr) {
      console.error("PDF parsing error:", parseErr);
      return res.status(400).json({ message: "Could not read or extract text from this PDF file." });
    }

    if (!resumeText) {
      return res.status(400).json({ message: "Uploaded PDF appears to be empty or contains no extractable text." });
    }

    const key = getSessionKey(req);
    const fileName = req.file.originalname || "resume.pdf";

    // Save in memory cache
    const existing = memoryStore.get(key) || {};
    memoryStore.set(key, { ...existing, resumeText, resumeFileName: fileName });

    // Save in database if user is authenticated
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        resumeText,
        resumeFileName: fileName,
      }).catch((e) => console.warn("Failed saving resume to user document:", e.message));
    }

    return res.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        fileName,
        textLength: resumeText.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Resume upload failed",
    });
  }
};

// ==========================================
// 2. 🔹 EXTRACT JOB DETAILS
// ==========================================
const extractJob = async (req, res) => {
  try {
    const jdText = (req.body.text || req.body.job_description || req.body.jd || "").trim();

    if (!jdText) {
      return res.status(400).json({ message: "Job description text is required" });
    }

    const prompt = `You are an expert job description parser. Extract structured details from the following job description.
It can be for ANY profession or industry (software, marketing, data, finance, design, HR, engineering, sales, management, etc.).

Return ONLY a valid JSON object matching this schema:
{
  "role": string,
  "company": string,
  "location": string,
  "experience": string,
  "salary": string,
  "skills": string[]
}

Rules:
- "role": Specific job title (e.g. "Senior Frontend Engineer", "Marketing Lead"). If not explicitly mentioned, return "Not specified".
- "company": Organization or hiring company. If not explicitly mentioned, return "Not specified".
- "location": Work location, city, country, or "Remote" / "Hybrid". If not explicitly mentioned, return "Not specified".
- "experience": Required years or level (e.g. "3+ years", "Senior level"). If not explicitly mentioned, return "Not specified".
- "salary": Compensation or pay range. If not explicitly mentioned, return "Not specified".
- "skills": Array of required or mentioned competencies, technical tools, frameworks, concepts, or qualifications. If none found, return [].

Job Description:
${jdText}`;

    const rawData = await callGroq([{ role: "user", content: prompt }]);

    // Normalize and validate response data
    const jobData = {
      role: rawData.role && rawData.role !== "null" ? String(rawData.role).trim() : "Not specified",
      company: rawData.company && rawData.company !== "null" ? String(rawData.company).trim() : "Not specified",
      location: rawData.location && rawData.location !== "null" ? String(rawData.location).trim() : "Not specified",
      experience: rawData.experience && rawData.experience !== "null" ? String(rawData.experience).trim() : "Not specified",
      salary: rawData.salary && rawData.salary !== "null" ? String(rawData.salary).trim() : "Not specified",
      skills: Array.isArray(rawData.skills) ? rawData.skills.map((s) => String(s).trim()).filter(Boolean) : [],
    };

    const key = getSessionKey(req);
    const existing = memoryStore.get(key) || {};
    memoryStore.set(key, { ...existing, jobData, jdText });

    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        lastJobData: jobData,
        lastJobDescription: jdText,
      }).catch((e) => console.warn("Failed saving job data to user document:", e.message));
    }

    return res.json({
      success: true,
      data: jobData,
    });
  } catch (error) {
    console.error("Extract error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to extract job details",
    });
  }
};

// ==========================================
// 3. 🔹 MATCH RESUME TO JD
// ==========================================
const matchResume = async (req, res) => {
  try {
    const key = getSessionKey(req);
    const sessionData = memoryStore.get(key) || {};

    // 1. Resolve Resume Text
    let resumeText = (req.body.resume_text || "").trim();
    if (!resumeText && req.user?.resumeText) {
      resumeText = req.user.resumeText;
    }
    if (!resumeText && sessionData.resumeText) {
      resumeText = sessionData.resumeText;
    }

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume not found. Please upload your PDF resume first before calculating match score.",
      });
    }

    // 2. Resolve Job Data / Description
    let jobData = req.body.job_data || sessionData.jobData || req.user?.lastJobData;
    let jdText = (req.body.text || req.body.jd || sessionData.jdText || req.user?.lastJobDescription || "").trim();

    if (!jobData && !jdText) {
      return res.status(400).json({
        message: "Job description not found. Please paste a job description first.",
      });
    }

    const prompt = `You are an expert ATS resume evaluator and talent matching specialist.
Evaluate the candidate's resume against the target job requirements.
The job can belong to ANY industry (tech, marketing, data, finance, design, HR, engineering, etc.).

Rules:
1. "matchScore": An integer from 0 to 100 representing realistic overall alignment.
   - High match (70-100%): Candidate has majority of core required competencies and relevant background.
   - Moderate match (40-69%): Candidate has transferable skills or partial overlap, but lacks key qualifications.
   - Low match (0-39%): Severe skill gap or different domain.
2. "strengths": An array of specific skills, tools, or qualifications requested by the job that ARE present or demonstrated in the candidate's resume.
3. "missingSkills": An array of specific skills, tools, or qualifications requested by the job that are ABSENT or unmentioned in the candidate's resume.
4. "suggestion": 1-2 actionable, direct sentences advising the candidate on how to improve their alignment with this specific role.

Return ONLY a valid JSON object matching this schema:
{
  "matchScore": number,
  "strengths": string[],
  "missingSkills": string[],
  "suggestion": string
}

Candidate Resume:
${resumeText.slice(0, 4000)}

Target Job Information:
${JSON.stringify(jobData || jdText, null, 2)}`;

    const rawResult = await callGroq([{ role: "user", content: prompt }]);

    const matchResult = {
      matchScore: Math.min(100, Math.max(0, parseInt(rawResult.matchScore, 10) || 0)),
      strengths: Array.isArray(rawResult.strengths) ? rawResult.strengths.map(String).filter(Boolean) : [],
      missingSkills: Array.isArray(rawResult.missingSkills) ? rawResult.missingSkills.map(String).filter(Boolean) : [],
      suggestion: rawResult.suggestion ? String(rawResult.suggestion).trim() : "Consider tailoring your resume to highlight the required job qualifications.",
    };

    // Cache match result
    memoryStore.set(key, { ...sessionData, matchResult });

    return res.json({
      success: true,
      data: matchResult,
    });
  } catch (error) {
    console.error("Match error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to calculate resume match",
    });
  }
};

// ==========================================
// 4. 🔹 CAREER ADVICE
// ==========================================
const getAdvice = async (req, res) => {
  try {
    const key = getSessionKey(req);
    const sessionData = memoryStore.get(key) || {};

    let resumeText = (req.body.resume_text || "").trim();
    if (!resumeText && req.user?.resumeText) resumeText = req.user.resumeText;
    if (!resumeText && sessionData.resumeText) resumeText = sessionData.resumeText;

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume not found. Please upload your PDF resume first.",
      });
    }

    let jobData = req.body.job_data || sessionData.jobData || req.user?.lastJobData;
    let jdText = (req.body.text || req.body.jd || sessionData.jdText || req.user?.lastJobDescription || "").trim();

    if (!jobData && !jdText) {
      return res.status(400).json({
        message: "Job description not found. Please paste a job description first.",
      });
    }

    const matchResult = req.body.match_result || sessionData.matchResult;

    const prompt = `You are a strategic career advisor and recruitment coach.
Analyze the candidate's background against the target job requirements and match analysis.
The role can belong to ANY industry or profession.

Rules:
1. "shouldApply": boolean. Set to true if the candidate has a viable chance or manageable gaps (typically match score >= 55% or strong core transferability); set to false if critical non-negotiable prerequisites are completely missing.
2. "reason": A clear, professional, 1-2 sentence explanation of the recommendation.
3. "improvements": An array of 2-4 concrete, high-impact action items the candidate should undertake to bridge gaps or stand out.
4. "encouragement": An inspiring, constructive one-sentence closing statement.

Return ONLY a valid JSON object matching this schema:
{
  "shouldApply": boolean,
  "reason": string,
  "improvements": string[],
  "encouragement": string
}

Candidate Background:
${resumeText.slice(0, 3000)}

Target Job:
${JSON.stringify(jobData || jdText, null, 2)}

Match Analysis (if available):
${matchResult ? JSON.stringify(matchResult, null, 2) : "Not yet calculated"}`;

    const rawResult = await callGroq([{ role: "user", content: prompt }]);

    const advice = {
      shouldApply: Boolean(rawResult.shouldApply),
      reason: rawResult.reason ? String(rawResult.reason).trim() : "Review the recommended improvements below to prepare your application.",
      improvements: Array.isArray(rawResult.improvements) ? rawResult.improvements.map(String).filter(Boolean) : [],
      encouragement: rawResult.encouragement ? String(rawResult.encouragement).trim() : "Keep advancing your skills and pursuing aligned opportunities!",
    };

    return res.json({
      success: true,
      data: advice,
    });
  } catch (error) {
    console.error("Advice error:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to generate career advice",
    });
  }
};

module.exports = {
  uploadResume,
  extractJob,
  matchResume,
  getAdvice,
};