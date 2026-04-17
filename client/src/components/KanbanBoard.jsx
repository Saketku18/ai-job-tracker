import ApplicationCard from "./ApplicationCard"

const COLUMNS = [
  { id: "applied",   label: "Applied",   color: "#3B82F6", light: "rgba(59,130,246,0.15)" },
  { id: "interview", label: "Interview", color: "#F59E0B", light: "rgba(245,158,11,0.15)" },
  { id: "offer",     label: "Offer",     color: "#10B981", light: "rgba(16,185,129,0.15)" },
  { id: "rejected",  label: "Rejected",  color: "#EF4444", light: "rgba(239,68,68,0.15)"  },
]

function KanbanBoard({ applications, onUpdate, onDelete }) {
  return (
    <div style={styles.board}>
      {COLUMNS.map((col) => {
        const colApps = applications.filter((a) => a.status === col.id)
        return (
          <div key={col.id} style={styles.column}>
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={{ ...styles.dot, background: col.color }} />
                <span style={{ ...styles.label, color: col.color }}>{col.label}</span>
              </div>
              <span style={{ ...styles.count, background: col.light, color: col.color }}>
                {colApps.length}
              </span>
            </div>

            <div>
              {colApps.length === 0 ? (
                <div style={styles.empty}>No applications</div>
              ) : (
                colApps.map((app) => (
                  <ApplicationCard key={app._id} app={app} onUpdate={onUpdate} onDelete={onDelete} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  board: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  column: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "16px", padding: "16px", minHeight: "500px",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid var(--border)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%" },
  label: {
    fontFamily: "Syne, sans-serif", fontWeight: 600,
    fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  count: {
    fontSize: "12px", fontWeight: 600,
    padding: "2px 8px", borderRadius: "999px",
  },
  empty: {
    textAlign: "center", padding: "40px 20px", color: "var(--muted)",
    fontSize: "13px", border: "1px dashed var(--border)", borderRadius: "12px",
  },
}

export default KanbanBoard