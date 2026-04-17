import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function AIAnalyzer() {
  const navigate = useNavigate()
  const [jd, setJd] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState("")

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    setLoading("upload")
    await API.post("http://localhost:8000/upload-resume", formData)
    setLoading("")
    alert("Resume uploaded!")
  }

  const handleExtract = async () => {
    setLoading("extract")
    const res = await API.post("http://localhost:8000/extract", { job_description: jd })
    setResult({ type: "extract", data: res.data.data })
    setLoading("")
  }

  const handleMatch = async () => {
    setLoading("match")
    const res = await API.post("http://localhost:8000/match", { job_description: jd })
    setResult({ type: "match", data: res.data.data })
    setLoading("")
  }

  const handleAdvice = async () => {
    setLoading("advice")
    const res = await API.post("http://localhost:8000/advise", { job_description: jd })
    setResult({ type: "advice", data: res.data.data })
    setLoading("")
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2 style={{ color: "var(--text)", fontFamily: "Syne, sans-serif" }}>
          AI Resume Analyzer
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--muted)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "DM Sans, sans-serif" }}
        >
          ← Dashboard
        </button>
      </div>

      {/* Upload */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "var(--muted)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
          UPLOAD RESUME (PDF)
        </label>
        <input type="file" accept=".pdf" onChange={handleUpload} />
        {loading === "upload" && <p style={{ color: "var(--muted)", fontSize: "13px" }}>Uploading...</p>}
      </div>

      {/* JD */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "var(--muted)", fontSize: "12px", display: "block", marginBottom: "8px" }}>
          JOB DESCRIPTION
        </label>
        <textarea
          rows={6}
          placeholder="Paste job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          style={{ width: "100%", padding: "12px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "13px", outline: "none", fontFamily: "DM Sans, sans-serif", resize: "vertical" }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button onClick={handleExtract} style={{ flex: 1, padding: "10px", background: "#3B82F6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          {loading === "extract" ? "Extracting..." : "Extract JD"}
        </button>
        <button onClick={handleMatch} style={{ flex: 1, padding: "10px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          {loading === "match" ? "Matching..." : "Match Resume"}
        </button>
        <button onClick={handleAdvice} style={{ flex: 1, padding: "10px", background: "#8B5CF6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
          {loading === "advice" ? "Analyzing..." : "Get Advice"}
        </button>
      </div>

      {/* Extract Result */}
      {result?.type === "extract" && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: "var(--text)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>Extracted Data</h3>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Role: <span style={{ color: "var(--text)" }}>{result.data.role}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Company: <span style={{ color: "var(--text)" }}>{result.data.company}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Location: <span style={{ color: "var(--text)" }}>{result.data.location}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Experience: <span style={{ color: "var(--text)" }}>{result.data.experience}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Salary: <span style={{ color: "var(--text)" }}>{result.data.salary}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Skills: <span style={{ color: "var(--accent)" }}>{result.data.skills?.join(", ")}</span></p>
        </div>
      )}

      {/* Match Result */}
      {result?.type === "match" && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: "var(--text)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>Match Result</h3>
          <p style={{ color: "var(--accent)", fontSize: "28px", fontWeight: 700, fontFamily: "Syne, sans-serif" }}>{result.data.matchScore}%</p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Missing: <span style={{ color: "#F87171" }}>{result.data.missingSkills?.join(", ")}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Strengths: <span style={{ color: "#34D399" }}>{result.data.strengths?.join(", ")}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Suggestion: <span style={{ color: "var(--text)" }}>{result.data.suggestion}</span></p>
        </div>
      )}

      {/* Advice Result */}
      {result?.type === "advice" && (
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ color: "var(--text)", marginBottom: "12px", fontFamily: "Syne, sans-serif" }}>Career Advice</h3>
          <p style={{ color: result.data.shouldApply ? "#34D399" : "#F87171", fontSize: "16px", fontWeight: 600, marginBottom: "10px" }}>
            {result.data.shouldApply ? "✓ You should apply!" : "✗ Not ready yet"}
          </p>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>Reason: <span style={{ color: "var(--text)" }}>{result.data.reason}</span></p>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "8px" }}>Improvements:</p>
          <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
            {result.data.improvements?.map((item, i) => (
              <li key={i} style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "4px" }}>{item}</li>
            ))}
          </ul>
          <p style={{ color: "var(--accent)", fontSize: "13px", fontStyle: "italic", marginTop: "12px" }}>"{result.data.encouragement}"</p>
        </div>
      )}
    </div>
  )
}

export default AIAnalyzer