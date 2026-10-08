import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function AIAnalyzer() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [jd, setJd] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState("")
  const [fileName, setFileName] = useState("")
  const [alert, setAlert] = useState(null) // { type: 'success' | 'error', message: string }

  const showAlert = (type, message) => {
    setAlert({ type, message })
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setAlert(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading("upload")
      await API.post("/ai/upload", formData)
      showAlert("success", `"${file.name}" uploaded successfully! You can now match or request advice.`)
    } catch (err) {
      console.error(err)
      showAlert("error", err.response?.data?.message || "Resume upload failed. Please try again.")
    } finally {
      setLoading("")
    }
  }

  const handleExtract = async () => {
    if (!jd.trim()) {
      showAlert("error", "Please paste a job description first before extracting details.")
      return
    }
    setAlert(null)
    try {
      setLoading("extract")
      const res = await API.post("/ai/extract", {
        text: jd,
      })
      setResult({
        type: "extract",
        data: res.data.data,
      })
      showAlert("success", "Job details extracted successfully!")
    } catch (err) {
      console.error(err)
      showAlert("error", err.response?.data?.message || "Failed to extract job details.")
    } finally {
      setLoading("")
    }
  }

  const handleMatch = async () => {
    if (!jd.trim()) {
      showAlert("error", "Please paste a job description first before calculating match score.")
      return
    }
    setAlert(null)
    try {
      setLoading("match")
      const res = await API.post("/ai/match", { text: jd })
      setResult({
        type: "match",
        data: res.data.data,
      })
      showAlert("success", "Resume match calculated successfully!")
    } catch (err) {
      console.error(err)
      showAlert("error", err.response?.data?.message || "Failed to calculate match. Please ensure resume is uploaded.")
    } finally {
      setLoading("")
    }
  }

  const handleAdvice = async () => {
    if (!jd.trim()) {
      showAlert("error", "Please paste a job description first before requesting career advice.")
      return
    }
    setAlert(null)
    try {
      setLoading("advice")
      const res = await API.post("/ai/advise", { text: jd })
      setResult({
        type: "advice",
        data: res.data.data,
      })
      showAlert("success", "Career advice generated successfully!")
    } catch (err) {
      console.error(err)
      showAlert("error", err.response?.data?.message || "Failed to generate advice. Please ensure resume is uploaded.")
    } finally {
      setLoading("")
    }
  }

  const toArray = (val) => {
    if (Array.isArray(val)) return val
    if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean)
    return []
  }

  return (
    <div style={s.pageWrapper}>
      <div style={s.container}>
        {/* Header Bar */}
        <header style={s.header}>
          <div>
            <div style={s.badge}>
              <span style={s.badgeDot} />
              AI Intelligence Suite
            </div>
            <h1 style={s.title}>Resume & JD Analyzer</h1>
            <p style={s.subtitle}>
              Extract requirements from job descriptions, check your ATS compatibility score, and receive AI-driven career advice.
            </p>
          </div>
          <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
        </header>

        {/* Dismissible Alert Banner */}
        {alert && (
          <div
            style={{
              ...s.alertBanner,
              background: alert.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
              borderColor: alert.type === "success" ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.35)",
              color: alert.type === "success" ? "#34D399" : "#F87171",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {alert.type === "success" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{alert.message}</span>
            </div>
            <button onClick={() => setAlert(null)} style={s.alertCloseBtn}>✕</button>
          </div>
        )}

        {/* Inputs Workspace Card */}
        <div style={s.card}>
          {/* Resume Upload Dropzone */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <span style={s.sectionNumber}>1</span>
              <div>
                <label style={s.sectionLabel}>Upload Resume (PDF)</label>
                <p style={s.sectionHint}>Antigravity AI extracts your experience and skills directly from your resume</p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleUpload}
              style={{ display: "none" }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                ...s.dropzone,
                borderColor: fileName ? "rgba(16, 185, 129, 0.4)" : "var(--border2)",
                background: fileName ? "rgba(16, 185, 129, 0.04)" : "var(--bg3)",
              }}
            >
              <div style={s.dropzoneContent}>
                <div style={{ ...s.uploadIconCircle, background: fileName ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)" }}>
                  {loading === "upload" ? (
                    <span className="spinner" style={{ width: "20px", height: "20px" }} />
                  ) : fileName ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: fileName ? "#34D399" : "var(--text)" }}>
                    {loading === "upload"
                      ? "Uploading resume to analyzer..."
                      : fileName
                      ? fileName
                      : "Choose a PDF file or click to browse"}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "3px" }}>
                    {fileName ? "✓ File uploaded and ready for analysis" : "Supported format: PDF (Max 10MB)"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                style={s.browseBtn}
              >
                {fileName ? "Change PDF" : "Browse File"}
              </button>
            </div>
          </div>

          <div style={s.divider} />

          {/* Job Description Textarea */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <span style={s.sectionNumber}>2</span>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <label style={s.sectionLabel}>Job Description</label>
                  <p style={s.sectionHint}>Paste the full job posting, duties, and required qualifications</p>
                </div>
                {jd.length > 0 && (
                  <span style={s.charCounter}>{jd.length} chars</span>
                )}
              </div>
            </div>

            <textarea
              rows={6}
              placeholder="Paste job description text here (e.g. responsibilities, required skills, experience level, tech stack)..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              style={s.textarea}
            />
          </div>

          {/* Action Trigger Buttons */}
          <div style={s.actionRow}>
            {/* Extract Button */}
            <button
              onClick={handleExtract}
              disabled={Boolean(loading)}
              style={{ ...s.actionBtn, background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
            >
              {loading === "extract" ? (
                <>
                  <span className="spinner" style={{ width: "16px", height: "16px" }} />
                  Extracting JD...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Extract JD Details
                </>
              )}
            </button>

            {/* Match Resume Button */}
            <button
              onClick={handleMatch}
              disabled={Boolean(loading)}
              style={{ ...s.actionBtn, background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}
            >
              {loading === "match" ? (
                <>
                  <span className="spinner" style={{ width: "16px", height: "16px" }} />
                  Matching Resume...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Match Resume Score
                </>
              )}
            </button>

            {/* Career Advice Button */}
            <button
              onClick={handleAdvice}
              disabled={Boolean(loading)}
              style={{ ...s.actionBtn, background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
            >
              {loading === "advice" ? (
                <>
                  <span className="spinner" style={{ width: "16px", height: "16px" }} />
                  Analyzing Fit...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Get Career Advice
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= RESULTS SECTION ================= */}

        {/* 1. EXTRACT RESULT */}
        {result?.type === "extract" && (
          <div style={s.resultCard}>
            <div style={s.resultHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ ...s.iconPill, background: "rgba(37, 99, 235, 0.15)", color: "#60A5FA" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <h3 style={s.resultTitle}>Extracted Job Specification</h3>
                  <p style={s.resultSubtitle}>Key attributes parsed by AI from the job posting</p>
                </div>
              </div>
              <span style={s.tagBlue}>JD Parse Complete</span>
            </div>

            <div style={s.grid}>
              <div style={s.gridItem}>
                <span style={s.gridLabel}>ROLE / TITLE</span>
                <span style={s.gridValue}>{result.data?.role || "Not specified"}</span>
              </div>
              <div style={s.gridItem}>
                <span style={s.gridLabel}>COMPANY</span>
                <span style={s.gridValue}>{result.data?.company || "Not specified"}</span>
              </div>
              <div style={s.gridItem}>
                <span style={s.gridLabel}>LOCATION</span>
                <span style={s.gridValue}>{result.data?.location || "Not specified"}</span>
              </div>
              <div style={s.gridItem}>
                <span style={s.gridLabel}>EXPERIENCE LEVEL</span>
                <span style={s.gridValue}>{result.data?.experience || "Not specified"}</span>
              </div>
              <div style={s.gridItem}>
                <span style={s.gridLabel}>SALARY / COMPENSATION</span>
                <span style={s.gridValue}>{result.data?.salary || "Not specified"}</span>
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginTop: "20px" }}>
              <span style={s.gridLabel}>REQUIRED & MENTIONED SKILLS</span>
              <div style={s.tagsWrap}>
                {toArray(result.data?.skills).length > 0 ? (
                  toArray(result.data?.skills).map((skill, i) => (
                    <span key={i} style={s.skillPill}>{skill}</span>
                  ))
                ) : (
                  <span style={{ color: "var(--muted)", fontSize: "13px" }}>None parsed</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. MATCH RESULT */}
        {result?.type === "match" && (
          <div style={s.resultCard}>
            <div style={s.resultHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ ...s.iconPill, background: "rgba(16, 185, 129, 0.15)", color: "#34D399" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                </div>
                <div>
                  <h3 style={s.resultTitle}>Resume Match Analysis</h3>
                  <p style={s.resultSubtitle}>ATS alignment score and skill gap evaluation</p>
                </div>
              </div>
              <span style={s.tagGreen}>Match Evaluation</span>
            </div>

            {/* Score Hero Section */}
            <div style={s.scoreBox}>
              <div style={s.scoreLeft}>
                <span style={s.scoreLabel}>OVERALL MATCH SCORE</span>
                <div style={s.scoreNumber}>
                  {result.data?.matchScore !== undefined ? `${result.data?.matchScore}%` : "—"}
                </div>
                <div style={s.scoreBarWrap}>
                  <div
                    style={{
                      ...s.scoreBarFill,
                      width: `${Math.min(100, Math.max(0, Number(result.data?.matchScore) || 0))}%`,
                      background:
                        Number(result.data?.matchScore) >= 75
                          ? "linear-gradient(90deg, #10B981, #34D399)"
                          : Number(result.data?.matchScore) >= 50
                          ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                          : "linear-gradient(90deg, #EF4444, #F87171)",
                    }}
                  />
                </div>
              </div>

              <div style={s.scoreRight}>
                <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                  {Number(result.data?.matchScore) >= 75
                    ? "Strong candidate profile! Your skills align closely with the target role requirements."
                    : Number(result.data?.matchScore) >= 50
                    ? "Moderate alignment. Review the missing skills below to address gaps in your application."
                    : "Low alignment detected. Consider tailoring your resume with key missing technologies."}
                </div>
              </div>
            </div>

            {/* Strengths & Missing Skills Columns */}
            <div style={s.twoCol}>
              <div style={s.subCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={s.dotGreen} />
                  <span style={s.subCardTitle}>Strengths & Matched Skills</span>
                </div>
                <div style={s.tagsWrap}>
                  {toArray(result.data?.strengths).length > 0 ? (
                    toArray(result.data?.strengths).map((sText, i) => (
                      <span key={i} style={s.strengthTag}>✓ {sText}</span>
                    ))
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>No direct strengths identified</span>
                  )}
                </div>
              </div>

              <div style={s.subCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={s.dotRed} />
                  <span style={s.subCardTitle}>Missing Skills & Gaps</span>
                </div>
                <div style={s.tagsWrap}>
                  {toArray(result.data?.missingSkills).length > 0 ? (
                    toArray(result.data?.missingSkills).map((mText, i) => (
                      <span key={i} style={s.missingTag}>• {mText}</span>
                    ))
                  ) : (
                    <span style={{ color: "#34D399", fontSize: "13px" }}>No missing skills found!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestion Callout */}
            {result.data?.suggestion && (
              <div style={s.suggestionCallout}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>💡</span>
                  <div>
                    <strong style={{ color: "var(--text)", fontSize: "13.5px", display: "block", marginBottom: "4px" }}>
                      AI Strategic Suggestion
                    </strong>
                    <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                      {result.data.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ADVICE RESULT */}
        {result?.type === "advice" && (
          <div style={s.resultCard}>
            <div style={s.resultHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ ...s.iconPill, background: "rgba(139, 92, 246, 0.15)", color: "#A78BFA" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div>
                  <h3 style={s.resultTitle}>Career Advisory & Next Steps</h3>
                  <p style={s.resultSubtitle}>Actionable guidance tailored to your experience profile</p>
                </div>
              </div>
              <span style={s.tagPurple}>Advisor Verdict</span>
            </div>

            {/* Verdict Callout */}
            <div
              style={{
                ...s.verdictBox,
                background: result.data?.shouldApply ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                borderColor: result.data?.shouldApply ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    ...s.verdictIcon,
                    background: result.data?.shouldApply ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    color: result.data?.shouldApply ? "#34D399" : "#F87171",
                  }}
                >
                  {result.data?.shouldApply ? "✓" : "!"}
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: result.data?.shouldApply ? "#34D399" : "#F87171" }}>
                    {result.data?.shouldApply ? "Recommended to Apply!" : "Hold Off / Address Skill Gaps First"}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                    {result.data?.reason || "Review the recommendations below to strengthen your candidacy."}
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Improvements List */}
            {toArray(result.data?.improvements).length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <span style={s.gridLabel}>RECOMMENDED IMPROVEMENTS</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  {toArray(result.data?.improvements).map((item, i) => (
                    <div key={i} style={s.improvementRow}>
                      <span style={s.improvementNum}>{i + 1}</span>
                      <span style={{ fontSize: "13.5px", color: "var(--text)", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encouragement Quote */}
            {result.data?.encouragement && (
              <div style={s.quoteBox}>
                <span style={s.quoteIcon}>“</span>
                <p style={s.quoteText}>{result.data.encouragement}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State / How to Use Guide */}
        {!result && (
          <div style={s.guideCard}>
            <h4 style={s.guideTitle}>How the AI Resume Analyzer works</h4>
            <div style={s.stepsGrid}>
              <div style={s.stepCard}>
                <div style={s.stepNum}>1</div>
                <div style={s.stepName}>Upload Resume</div>
                <div style={s.stepDesc}>Provide your existing resume in PDF format for the parser.</div>
              </div>
              <div style={s.stepCard}>
                <div style={s.stepNum}>2</div>
                <div style={s.stepName}>Paste Job Spec</div>
                <div style={s.stepDesc}>Copy the job description from LinkedIn, Indeed, or company portals.</div>
              </div>
              <div style={s.stepCard}>
                <div style={s.stepNum}>3</div>
                <div style={s.stepName}>Analyze & Match</div>
                <div style={s.stepDesc}>Run any of the 3 actions above to generate ATS insights and advice.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  pageWrapper: {
    minHeight: "100vh",
    background: "var(--bg)",
    padding: "36px 20px 60px",
  },
  container: {
    maxWidth: "840px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "20px",
    background: "rgba(232, 255, 71, 0.08)",
    border: "1px solid rgba(232, 255, 71, 0.25)",
    color: "var(--accent)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "10px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "Syne, sans-serif",
    letterSpacing: "-0.02em",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: "13.5px",
    color: "var(--muted)",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "580px",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    color: "var(--text)",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "DM Sans, sans-serif",
    transition: "all 0.15s ease",
  },
  alertBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid",
    marginBottom: "20px",
  },
  alertCloseBtn: {
    background: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px",
    opacity: 0.8,
  },
  card: {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "18px",
    padding: "26px",
    marginBottom: "24px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
  },
  section: {
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  sectionNumber: {
    width: "24px",
    height: "24px",
    borderRadius: "7px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid var(--border2)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "Syne, sans-serif",
    flexShrink: 0,
  },
  sectionLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
  },
  sectionHint: {
    fontSize: "12px",
    color: "var(--muted)",
    margin: "2px 0 0",
  },
  dropzone: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    border: "1.5px dashed var(--border2)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    gap: "12px",
  },
  dropzoneContent: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  uploadIconCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  browseBtn: {
    background: "var(--bg4)",
    border: "1px solid var(--border2)",
    color: "var(--text)",
    padding: "7px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
    margin: "20px 0",
  },
  charCounter: {
    fontSize: "11px",
    color: "var(--muted)",
    background: "var(--bg3)",
    padding: "2px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--text)",
    fontSize: "13.5px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    resize: "vertical",
    lineHeight: 1.5,
    minHeight: "120px",
    transition: "border-color 0.15s ease",
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginTop: "22px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 18px",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "Syne, sans-serif",
    fontWeight: 600,
    fontSize: "13.5px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    transition: "all 0.15s ease",
  },
  resultCard: {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    marginBottom: "24px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  iconPill: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  resultTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "Syne, sans-serif",
    margin: "0 0 2px",
  },
  resultSubtitle: {
    fontSize: "12.5px",
    color: "var(--muted)",
    margin: 0,
  },
  tagBlue: {
    background: "rgba(37, 99, 235, 0.12)",
    border: "1px solid rgba(37, 99, 235, 0.3)",
    color: "#60A5FA",
    fontSize: "11.5px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  tagGreen: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#34D399",
    fontSize: "11.5px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  tagPurple: {
    background: "rgba(139, 92, 246, 0.12)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#A78BFA",
    fontSize: "11.5px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "10px",
  },
  gridItem: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "12px 14px",
  },
  gridLabel: {
    display: "block",
    fontSize: "10.5px",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "4px",
  },
  gridValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
  },
  tagsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },
  skillPill: {
    background: "rgba(232, 255, 71, 0.1)",
    border: "1px solid rgba(232, 255, 71, 0.25)",
    color: "var(--accent)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
  scoreBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "20px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "20px",
    alignItems: "center",
  },
  scoreLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  scoreRight: {
    borderLeft: "1px solid var(--border)",
    paddingLeft: "20px",
  },
  scoreLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--muted)",
    letterSpacing: "0.06em",
  },
  scoreNumber: {
    fontSize: "42px",
    fontWeight: 800,
    fontFamily: "Syne, sans-serif",
    color: "var(--text)",
    lineHeight: 1,
    letterSpacing: "-0.03em",
  },
  scoreBarWrap: {
    height: "7px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "6px",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.4s ease",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
    marginBottom: "16px",
  },
  subCard: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px",
  },
  subCardTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
  },
  dotGreen: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#34D399",
  },
  dotRed: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#F87171",
  },
  strengthTag: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    color: "#34D399",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
  missingTag: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.25)",
    color: "#F87171",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
  suggestionCallout: {
    background: "rgba(232, 255, 71, 0.05)",
    border: "1px solid rgba(232, 255, 71, 0.2)",
    borderRadius: "12px",
    padding: "14px 18px",
  },
  verdictBox: {
    border: "1px solid",
    borderRadius: "14px",
    padding: "16px 20px",
    marginBottom: "20px",
  },
  verdictIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 800,
    flexShrink: 0,
  },
  improvementRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    padding: "10px 14px",
    borderRadius: "10px",
  },
  improvementNum: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#A78BFA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    flexShrink: 0,
  },
  quoteBox: {
    marginTop: "20px",
    padding: "16px 20px",
    background: "var(--bg3)",
    borderLeft: "3px solid var(--accent)",
    borderRadius: "0 12px 12px 0",
    position: "relative",
  },
  quoteIcon: {
    fontSize: "32px",
    color: "var(--accent)",
    lineHeight: 0.8,
    fontFamily: "serif",
    display: "block",
    marginBottom: "4px",
    opacity: 0.8,
  },
  quoteText: {
    color: "var(--accent)",
    fontSize: "13.5px",
    fontStyle: "italic",
    lineHeight: 1.5,
    margin: 0,
  },
  guideCard: {
    background: "var(--bg2)",
    border: "1px dashed var(--border2)",
    borderRadius: "16px",
    padding: "24px",
  },
  guideTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text)",
    fontFamily: "Syne, sans-serif",
    margin: "0 0 16px",
    textAlign: "center",
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  stepCard: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
  },
  stepNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(232, 255, 71, 0.1)",
    border: "1px solid rgba(232, 255, 71, 0.25)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: "Syne, sans-serif",
    margin: "0 auto 10px",
  },
  stepName: {
    fontSize: "13.5px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "4px",
  },
  stepDesc: {
    fontSize: "12px",
    color: "var(--muted)",
    lineHeight: 1.4,
  },
}

export default AIAnalyzer