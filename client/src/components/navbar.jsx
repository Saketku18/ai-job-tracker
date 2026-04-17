import { useNavigate } from "react-router-dom"

function Navbar({ total }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logo}>JT</div>
        <span style={styles.brand}>JobTrack</span>
        <div style={styles.badge}>{total} applications</div>
      </div>
      <div style={styles.right}>
        <div style={styles.avatar}>{initials}</div>
        <span style={styles.name}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
        <button onClick={() => navigate("/analyzer")} style={{ background: "var(--accent)", color: "#0E0E11", padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, marginRight: "8px" }}>
  AI Analyzer
</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    height: "60px", background: "var(--bg2)",
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 28px",
    position: "sticky", top: 0, zIndex: 100,
  },
  left: { display: "flex", alignItems: "center", gap: "14px" },
  logo: {
    width: "34px", height: "34px", background: "var(--accent)",
    borderRadius: "10px", display: "flex", alignItems: "center",
    justifyContent: "center", fontFamily: "Syne, sans-serif",
    fontWeight: 700, fontSize: "13px", color: "#0E0E11",
  },
  brand: { fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: "17px", color: "var(--text)" },
  badge: {
    background: "rgba(200,251,90,0.1)", border: "1px solid rgba(200,251,90,0.2)",
    color: "var(--accent)", fontSize: "12px", padding: "3px 10px",
    borderRadius: "999px", fontWeight: 500,
  },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "var(--bg3)", border: "1px solid var(--border2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 600, color: "var(--accent)",
  },
  name: { fontSize: "14px", color: "var(--muted)" },
  logout: {
    background: "transparent", border: "1px solid var(--border2)",
    color: "var(--muted)", padding: "6px 14px", borderRadius: "8px",
    fontSize: "13px", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
  },
}

export default Navbar