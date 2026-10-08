import API from "../services/api"

const STATUS_OPTIONS = ["applied", "interview", "offer", "rejected"]

const STATUS_COLORS = {
  applied:   { bg: "rgba(59, 130, 246, 0.12)", border: "rgba(59, 130, 246, 0.28)", text: "#60A5FA", label: "Applied" },
  interview: { bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.28)", text: "#FCD34D", label: "Interview" },
  offer:     { bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.28)", text: "#34D399", label: "Offer" },
  rejected:  { bg: "rgba(239, 68, 68, 0.12)",  border: "rgba(239, 68, 68, 0.28)",  text: "#F87171", label: "Rejected" },
}

const ICON_COLORS = [
  { bg: "rgba(99, 102, 241, 0.15)", color: "#818CF8" },
  { bg: "rgba(16, 185, 129, 0.15)", color: "#34D399" },
  { bg: "rgba(245, 158, 11, 0.15)", color: "#FCD34D" },
  { bg: "rgba(59, 130, 246, 0.15)", color: "#60A5FA" },
  { bg: "rgba(236, 72, 153, 0.15)", color: "#F472B6" },
  { bg: "rgba(6, 182, 212, 0.15)",  color: "#22D3EE" },
]

function getIconColor(name = "") {
  let h = 0
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) % ICON_COLORS.length
  return ICON_COLORS[Math.abs(h)]
}

function ApplicationCard({ app, onUpdate, onDelete }) {
  const color = STATUS_COLORS[app.status] || STATUS_COLORS.applied
  const ic = getIconColor(app.company || "A")

  const handleStatusChange = async (e) => {
    try {
      const res = await API.put(`/applications/${app._id}`, { ...app, status: e.target.value })
      onUpdate(res.data)
    } catch (err) {
      console.error("Status update error:", err)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete application for ${app.role} at ${app.company}?`)) return
    try {
      await API.delete(`/applications/${app._id}`)
      onDelete(app._id)
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const date = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : ""

  return (
    <div style={styles.card} className="app-card">
      {/* Top row: Avatar + Role/Company + Delete */}
      <div style={styles.top}>
        <div style={{ ...styles.icon, background: ic.bg, color: ic.color }}>
          {app.company?.charAt(0).toUpperCase()}
        </div>

        <div style={styles.info}>
          <p style={styles.role} title={app.role}>{app.role}</p>
          <p style={styles.company} title={app.company}>
            {app.company}
            {app.location ? ` • ${app.location}` : ""}
          </p>
        </div>

        <button onClick={handleDelete} style={styles.del} title="Delete Application">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Skills tags */}
      {app.skills?.length > 0 && (
        <div style={styles.skills}>
          {app.skills.slice(0, 3).map((s) => (
            <span key={s} style={styles.skill}>{s}</span>
          ))}
          {app.skills.length > 3 && (
            <span style={{ ...styles.skill, opacity: 0.6 }}>+{app.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer: Date & Status dropdown */}
      <div style={styles.footer}>
        <span style={styles.date}>
          <svg style={{ marginRight: "4px", verticalAlign: "-1px" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date}
        </span>

        <select
          value={app.status}
          onChange={handleStatusChange}
          style={{
            ...styles.statusPill,
            background: color.bg,
            border: `1px solid ${color.border}`,
            color: color.text,
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_COLORS[s]?.label || s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "15px",
    marginBottom: "11px",
    boxShadow: "var(--shadow-sm)",
    transition: "transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
  },
  top: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
  },
  icon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "Syne, sans-serif",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  role: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "Syne, sans-serif",
    marginBottom: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.3,
  },
  company: {
    fontSize: "12px",
    color: "var(--muted)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.3,
  },
  del: {
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
    transition: "opacity 0.15s, color 0.15s",
    flexShrink: 0,
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginBottom: "12px",
  },
  skill: {
    fontSize: "11px",
    padding: "2px 8px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    borderRadius: "999px",
    fontWeight: 500,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid var(--border)",
    paddingTop: "10px",
  },
  date: {
    fontSize: "11.5px",
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
  },
  statusPill: {
    width: "auto",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11.5px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 0,
    textAlign: "center",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
  },
}

export default ApplicationCard