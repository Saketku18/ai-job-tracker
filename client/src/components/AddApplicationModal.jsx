import { useState, useEffect } from "react"
import API from "../services/api"

function AddApplicationModal({ onClose, onAdd }) {
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("applied")
  const [skills, setSkills] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleAdd = async (e) => {
    if (e) e.preventDefault()
    if (!role.trim() || !company.trim()) {
      return setError("Job role and company are required")
    }
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/applications", {
        role: role.trim(),
        company: company.trim(),
        location: location.trim(),
        status,
        skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      })
      onAdd(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={styles.overlay}
      className="fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div style={styles.modal} className="fade-up">
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Add Application</h3>
            <p style={styles.subtitle}>Track a new job opportunity and set its initial stage.</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn} title="Close modal">
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleAdd} style={styles.body}>
          {error && (
            <div style={styles.error}>
              <span style={{ fontWeight: 700 }}>Notice: </span>
              {error}
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Job Role *</label>
            <input
              placeholder="e.g. Frontend Developer, Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Company *</label>
            <input
              placeholder="e.g. Google, Zepto, Stripe, Linear"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Location</label>
              <input
                placeholder="e.g. Remote, Bangalore, SF"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Stage / Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Skills (comma separated)</label>
            <input
              placeholder="React, TypeScript, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.addBtn, opacity: loading ? 0.65 : 1 }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: "14px", height: "14px", borderTopColor: "#0B0C10" }} />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Application →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.72)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
    padding: "20px",
  },
  modal: {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
    boxShadow: "0 20px 48px rgba(0, 0, 0, 0.6)",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "22px 26px 18px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontFamily: "Syne, sans-serif",
    fontSize: "19px",
    color: "var(--text)",
    margin: 0,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "12.5px",
    color: "var(--muted)",
    marginTop: "3px",
    margin: 0,
  },
  closeBtn: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: {
    padding: "22px 26px",
  },
  field: {
    marginBottom: "12px",
  },
  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "4px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "6px",
  },
  error: {
    background: "rgba(255, 92, 92, 0.1)",
    border: "1px solid rgba(255, 92, 92, 0.3)",
    color: "#FF7070",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  footer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid var(--border)",
  },
  cancelBtn: {
    flex: 1,
    padding: "11px",
    background: "transparent",
    border: "1px solid var(--border2)",
    color: "var(--muted)",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "13.5px",
    fontWeight: 500,
  },
  addBtn: {
    flex: 2,
    padding: "11px",
    background: "var(--accent)",
    border: "none",
    color: "#0B0C10",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "13.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 2px 10px rgba(200, 251, 90, 0.25)",
  },
}

export default AddApplicationModal