import { useState, useEffect } from "react"
import API from "../services/api"
import Navbar from "../components/Navbar"
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (newApp) => setApplications([...applications, newApp])
  const handleUpdate = (updated) => setApplications(applications.map((a) => a._id === updated._id ? updated : a))
  const handleDelete = (id) => setApplications(applications.filter((a) => a._id !== id))

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase()
    return a.role?.toLowerCase().includes(q) || a.company?.toLowerCase().includes(q)
  })

  const stats = [
  { label: "Total",      value: applications.length,                                              color: "var(--text)" },
  { label: "Applied",    value: applications.filter((a) => a.status === "applied").length,    color: "#60A5FA" },
  { label: "Interviews", value: applications.filter((a) => a.status === "interview").length,  color: "#FCD34D" },
  { label: "Offers",     value: applications.filter((a) => a.status === "offer").length,      color: "#34D399" },
]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar total={applications.length} />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>
        <div style={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <p style={styles.statLabel}>{s.label}</p>
              <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              placeholder="Search role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button onClick={() => setShowModal(true)} style={styles.addBtn}>
            + Add Application
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            Loading applications...
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
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" },
  statCard: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 20px" },
  statLabel: { fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", fontWeight: 500 },
  statValue: { fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: 1 },
  toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "12px" },
  searchWrap: { position: "relative", flex: 1, maxWidth: "320px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "18px", pointerEvents: "none" },
  searchInput: {
    width: "100%", padding: "10px 14px 10px 36px",
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text)", fontSize: "14px",
    outline: "none", marginBottom: 0,
  },
  addBtn: {
    padding: "10px 20px", background: "var(--accent)", color: "#0E0E11",
    border: "none", borderRadius: "10px", fontFamily: "Syne, sans-serif",
    fontWeight: 600, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap",
  },
  loading: { display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--muted)", fontSize: "14px" },
  spinner: { width: "18px", height: "18px", border: "2px solid var(--border2)", borderTop: "2px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
}

export default Dashboard