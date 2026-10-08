import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Navbar({ total = 0 }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  const handleLogout = async () => {
    try {
      if (user?.refreshToken) {
        await API.post("/auth/logout", {
          refreshToken: user.refreshToken,
        })
      }
    } catch (err) {
      console.warn("Logout request failed:", err)
    } finally {
      localStorage.clear()
      navigate("/login")
    }
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logoBadge} onClick={() => navigate("/dashboard")}>
          <span style={styles.logoText}>JT</span>
        </div>
        <div style={styles.brandGroup} onClick={() => navigate("/dashboard")}>
          <span style={styles.brand}>JobTrack</span>
          <span style={styles.proPill}>AI</span>
        </div>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          <span>{total} {total === 1 ? "application" : "applications"}</span>
        </div>
      </div>

      <div style={styles.right}>
        <button
          onClick={() => navigate("/analyzer")}
          style={styles.analyzerBtn}
          title="Open AI Resume Analyzer"
        >
          <span style={{ fontSize: "14px" }}>✨</span>
          <span>AI Analyzer</span>
        </button>

        <div style={styles.userPill}>
          <div style={styles.avatar}>{initials}</div>
          <span style={styles.name}>{user?.name || "Candidate"}</span>
        </div>

        <button onClick={handleLogout} style={styles.logout} title="Sign out">
          Sign out
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    height: "64px",
    background: "rgba(18, 20, 29, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoBadge: {
    width: "36px",
    height: "36px",
    background: "var(--accent)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(200, 251, 90, 0.25)",
    cursor: "pointer",
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: "14px",
    color: "#0B0C10",
    letterSpacing: "-0.02em",
  },
  brandGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  brand: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "18px",
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  proPill: {
    fontSize: "10px",
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: "999px",
    background: "var(--accent-dim)",
    color: "var(--accent)",
    border: "1px solid rgba(200, 251, 90, 0.25)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  badge: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    color: "var(--text2)",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginLeft: "4px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  analyzerBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "var(--accent)",
    color: "#0B0C10",
    padding: "8px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: "Syne, sans-serif",
    boxShadow: "0 2px 8px rgba(200, 251, 90, 0.2)",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    padding: "4px 10px 4px 5px",
    borderRadius: "999px",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "var(--bg4)",
    border: "1px solid var(--border2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--accent)",
    letterSpacing: "0.02em",
  },
  name: {
    fontSize: "13px",
    color: "var(--text)",
    fontWeight: 500,
    maxWidth: "140px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logout: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    padding: "7px 13px",
    borderRadius: "9px",
    fontSize: "12.5px",
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
  },
}

export default Navbar