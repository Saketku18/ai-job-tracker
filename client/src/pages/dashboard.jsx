import { useState, useEffect } from "react"
import API from "../services/api"
import Navbar from "../components/navbar"
import KanbanBoard from "../components/KanbanBoard"
import AddApplicationModal from "../components/AddApplicationModal"

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await API.get("/applications")
      setApplications(res.data)
    } catch (err) {
      console.error("Failed to load applications:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (newApp) => setApplications([...applications, newApp])
  const handleUpdate = (updated) =>
    setApplications(applications.map((a) => (a._id === updated._id ? updated : a)))
  const handleDelete = (id) =>
    setApplications(applications.filter((a) => a._id !== id))

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase()
    return a.role?.toLowerCase().includes(q) || a.company?.toLowerCase().includes(q)
  })

  const total = applications.length
  const appliedCount = applications.filter((a) => a.status === "applied").length
  const interviewCount = applications.filter((a) => a.status === "interview").length
  const offerCount = applications.filter((a) => a.status === "offer").length

  const stats = [
    {
      label: "Total Applications",
      value: total,
      color: "var(--text)",
      accentBorder: "rgba(255, 255, 255, 0.15)",
      pill: "All Tracked",
      pillBg: "var(--bg3)",
    },
    {
      label: "Applied",
      value: appliedCount,
      color: "#60A5FA",
      accentBorder: "rgba(96, 165, 250, 0.4)",
      pill: total > 0 ? `${Math.round((appliedCount / total) * 100)}%` : "0%",
      pillBg: "rgba(59, 130, 246, 0.12)",
    },
    {
      label: "Interviews",
      value: interviewCount,
      color: "#FCD34D",
      accentBorder: "rgba(252, 211, 77, 0.4)",
      pill: total > 0 ? `${Math.round((interviewCount / total) * 100)}%` : "0%",
      pillBg: "rgba(245, 158, 11, 0.12)",
    },
    {
      label: "Offers",
      value: offerCount,
      color: "#34D399",
      accentBorder: "rgba(52, 211, 153, 0.4)",
      pill: offerCount > 0 ? "Goal Met" : "Pipeline Active",
      pillBg: "rgba(16, 185, 129, 0.12)",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar total={applications.length} />

      <main style={styles.main}>
        {/* Welcome Section */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Pipeline Overview</h1>
            <p style={styles.subtitle}>
              Track your active job applications across each interview stage.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.stats}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                ...styles.statCard,
                borderTop: `2px solid ${s.accentBorder}`,
              }}
            >
              <div style={styles.statTop}>
                <span style={styles.statLabel}>{s.label}</span>
                <span style={{ ...styles.statPill, background: s.pillBg, color: s.color }}>
                  {s.pill}
                </span>
              </div>
              <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar: Search & Add button */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <svg
              style={styles.searchSvg}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button onClick={() => setShowModal(true)} style={styles.addBtn}>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            <span>Add Application</span>
          </button>
        </div>

        {/* Board or Loading Skeleton */}
        {loading ? (
          <div style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={styles.skeletonColumn}>
                <div style={{ ...styles.skeletonBar, width: "50%", height: "16px", marginBottom: "14px" }} />
                <div style={{ ...styles.skeletonCard, height: "110px" }} />
                <div style={{ ...styles.skeletonCard, height: "130px" }} />
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard applications={filtered} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
      </main>

      {showModal && (
        <AddApplicationModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}

const styles = {
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px 24px 48px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    color: "var(--text)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--muted)",
    marginTop: "4px",
    margin: 0,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },
  statCard: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "18px 20px",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  statTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "12px",
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  statPill: {
    fontSize: "11px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
  },
  statValue: {
    fontFamily: "Syne, sans-serif",
    fontSize: "32px",
    fontWeight: 800,
    lineHeight: 1,
    margin: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    gap: "14px",
    flexWrap: "wrap",
  },
  searchWrap: {
    position: "relative",
    flex: 1,
    minWidth: "260px",
    maxWidth: "400px",
  },
  searchSvg: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--muted)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "11px 16px 11px 40px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    marginBottom: 0,
    boxShadow: "var(--shadow-sm)",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 22px",
    background: "var(--accent)",
    color: "#0B0C10",
    border: "none",
    borderRadius: "12px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "13.5px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 10px rgba(200, 251, 90, 0.25)",
  },
  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(240px, 1fr))",
    gap: "16px",
    overflowX: "auto",
  },
  skeletonColumn: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "16px",
    minHeight: "440px",
  },
  skeletonBar: {
    background: "linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonLoad 1.5s infinite",
    borderRadius: "6px",
  },
  skeletonCard: {
    background: "linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonLoad 1.5s infinite",
    borderRadius: "12px",
    marginBottom: "12px",
  },
}

export default Dashboard