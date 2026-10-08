import ApplicationCard from "./ApplicationCard"

const COLUMNS = [
  { id: "applied", label: "Applied", color: "#60A5FA", bg: "rgba(59, 130, 246, 0.12)", border: "rgba(59, 130, 246, 0.25)" },
  { id: "interview", label: "Interview", color: "#FCD34D", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.25)" },
  { id: "offer", label: "Offer", color: "#34D399", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)" },
  { id: "rejected", label: "Rejected", color: "#F87171", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.25)" },
]

function KanbanBoard({ applications, onUpdate, onDelete }) {
  return (
    <div style={styles.board}>
      {COLUMNS.map((col) => {
        const colApps = applications.filter((a) => a.status === col.id)
        return (
          <div key={col.id} style={styles.column}>
            {/* Column Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={{ ...styles.dot, background: col.color, boxShadow: `0 0 8px ${col.color}40` }} />
                <span style={{ ...styles.label, color: col.color }}>{col.label}</span>
              </div>
              <span style={{ ...styles.count, background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>
                {colApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div style={styles.cardsWrap}>
              {colApps.length === 0 ? (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>○</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>No applications</p>
                  <p style={styles.emptySub}>Applications moved here will appear below</p>
                </div>
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
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(260px, 1fr))",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "16px",
    alignItems: "flex-start",
  },
  column: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "16px",
    minHeight: "520px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "var(--shadow-sm)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
    paddingBottom: "12px",
    borderBottom: "1px solid var(--border)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  label: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  count: {
    fontSize: "11px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
  },
  cardsWrap: {
    flex: 1,
  },
  empty: {
    textAlign: "center",
    padding: "48px 16px",
    color: "var(--muted)",
    fontSize: "12.5px",
    border: "1px dashed var(--border)",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  emptyIcon: {
    fontSize: "16px",
    color: "var(--muted)",
    marginBottom: "6px",
    opacity: 0.5,
  },
  emptySub: {
    fontSize: "11px",
    color: "var(--muted)",
    opacity: 0.7,
    marginTop: "4px",
    margin: 0,
  },
}

export default KanbanBoard