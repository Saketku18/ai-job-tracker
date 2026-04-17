import API from "../services/api"


const STATUS_OPTIONS = ["applied", "interview", "offer", "rejected"]

const STATUS_COLORS = {
  applied:   { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#60A5FA" },
  interview: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#FCD34D" },
  offer:     { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34D399" },
  rejected:  { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)",  text: "#F87171" },
}

const ICON_COLORS = [
  { bg: "rgba(124,58,237,0.15)", color: "#A78BFA" },
  { bg: "rgba(16,185,129,0.15)", color: "#34D399" },
  { bg: "rgba(245,158,11,0.15)", color: "#FCD34D" },
  { bg: "rgba(59,130,246,0.15)", color: "#60A5FA" },
  { bg: "rgba(239,68,68,0.15)",  color: "#F87171" },
]

function getIconColor(name) {
  let h = 0
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) % ICON_COLORS.length
  return ICON_COLORS[Math.abs(h)]
}

function ApplicationCard({ app, onUpdate, onDelete }) {
  const color = STATUS_COLORS[app.status] || STATUS_COLORS.Applied
  const ic = getIconColor(app.company)

  const handleStatusChange = async (e) => {
    const res = await API.put(`/applications/${app._id}`, { ...app, status: e.target.value })
    onUpdate(res.data)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete ${app.company} application?`)) return
    await API.delete(`/applications/${app._id}`)
    onDelete(app._id)
  }

  const date = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : ""

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={{ ...styles.icon, background: ic.bg, color: ic.color }}>
          {app.company?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.info}>
          <p style={styles.role}>{app.role}</p>
          <p style={styles.company}>{app.company}</p>
        </div>
        <button onClick={handleDelete} style={styles.del}>✕</button>
      </div>

      {app.skills?.length > 0 && (
        <div style={styles.skills}>
          {app.skills.slice(0, 3).map((s) => (
            <span key={s} style={styles.skill}>{s}</span>
          ))}
          {app.skills.length > 3 && (
            <span style={{ ...styles.skill, opacity: 0.5 }}>+{app.skills.length - 3}</span>
          )}
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.date}>{date}</span>
        <select
          value={app.status}
          onChange={handleStatusChange}
          style={{ ...styles.statusPill, background: color.bg, border: `1px solid ${color.border}`, color: color.text }}
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: "14px", padding: "14px", marginBottom: "10px",
    transition: "border-color 0.2s",
  },
  top: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" },
  icon: {
    width: "36px", height: "36px", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "15px", fontWeight: 600, flexShrink: 0,
    fontFamily: "Syne, sans-serif",
  },
  info: { flex: 1, minWidth: 0 },
  role: {
    fontSize: "14px", fontWeight: 500, color: "var(--text)",
    fontFamily: "Syne, sans-serif", marginBottom: "2px",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  company: { fontSize: "12px", color: "var(--muted)" },
  del: {
    background: "transparent", border: "none", color: "var(--muted)",
    cursor: "pointer", fontSize: "12px", padding: "2px 6px",
    borderRadius: "6px", opacity: 0.5, transition: "opacity 0.2s", flexShrink: 0,
  },
  skills: { display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" },
  skill: {
    fontSize: "11px", padding: "2px 8px", background: "var(--bg2)",
    border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "999px",
  },
  footer: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    borderTop: "1px solid var(--border)", paddingTop: "10px",
  },
  date: { fontSize: "11px", color: "var(--muted)" },
  statusPill: {
    width: "auto", padding: "4px 10px", borderRadius: "999px",
    fontSize: "11px", fontWeight: 500, cursor: "pointer",
    marginBottom: 0, appearance: "none", textAlign: "center",
  },
}

export default ApplicationCard