import { useState } from "react"
import API from "../services/api"

function AddApplicationModal({ onClose, onAdd }) {
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("applied")
  const [skills, setSkills] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!role || !company) return setError("Role and company are required")
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/applications", {
        role, company, location, status,
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
    <div style={styles.overlay} className="fade-in">
      <div style={styles.modal} className="fade-up">
        <div style={styles.header}>
          <h3 style={styles.title}>Add Application</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>
          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Job Role *</label>
          <input placeholder="Frontend Developer" value={role} onChange={(e) => setRole(e.target.value)} />

          <label style={styles.label}>Company *</label>
          <input placeholder="Google, Zepto..." value={company} onChange={(e) => setCompany(e.target.value)} />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Location</label>
              <input placeholder="Bangalore" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="applied">Applied</option>
  <option value="interview">Interview</option>
  <option value="offer">Offer</option>
  <option value="rejected">Rejected</option>
</select>
            </div>
          </div>

          <label style={styles.label}>Skills (comma separated)</label>
          <input placeholder="React, Node.js, MongoDB" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{ ...styles.addBtn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Adding..." : "Add Application →"}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 200, padding: "20px",
  },
  modal: {
    background: "var(--bg2)", border: "1px solid var(--border2)",
    borderRadius: "20px", width: "100%", maxWidth: "480px", overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", borderBottom: "1px solid var(--border)",
  },
  title: { fontFamily: "Syne, sans-serif", fontSize: "18px", color: "var(--text)" },
  closeBtn: {
    background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--muted)",
    width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", fontSize: "12px",
  },
  body: { padding: "20px 24px" },
  row: { display: "flex", gap: "12px" },
  label: {
    display: "block", fontSize: "11px", fontWeight: 500, color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px",
  },
  error: {
    background: "rgba(255,92,92,0.1)", border: "1px solid rgba(255,92,92,0.3)",
    color: "#FF5C5C", padding: "10px 14px", borderRadius: "10px",
    fontSize: "13px", marginBottom: "16px",
  },
  footer: {
    display: "flex", gap: "10px", padding: "16px 24px",
    borderTop: "1px solid var(--border)",
  },
  cancelBtn: {
    flex: 1, padding: "11px", background: "transparent",
    border: "1px solid var(--border2)", color: "var(--muted)",
    borderRadius: "10px", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "14px",
  },
  addBtn: {
    flex: 2, padding: "11px", background: "var(--accent)", border: "none",
    color: "#0E0E11", borderRadius: "10px", cursor: "pointer",
    fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "14px", transition: "opacity 0.2s",
  },
}

export default AddApplicationModal