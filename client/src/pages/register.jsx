import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/register", { name, email, password })
      localStorage.setItem("user", JSON.stringify(res.data))
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.logoRow}>
          <div style={s.logoBox}>JT</div>
          <span style={s.logoText}>JobTrack</span>
        </div>

        <h2 style={s.title}>Create account</h2>
        <p style={s.sub}>Start tracking your job search</p>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Full name</label>
        <input
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={s.input}
        />

        <label style={s.label}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
        />

        <label style={s.label}>Password</label>
        <input
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          style={s.input}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account..." : "Create account →"}
        </button>

        <p style={s.bottom}>
          Already have an account?{" "}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "20px",
    padding: "40px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoBox: {
    width: "38px",
    height: "38px",
    background: "var(--accent)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "14px",
    color: "#0E0E11",
  },
  logoText: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 600,
    fontSize: "18px",
    color: "var(--text)",
  },
  title: {
    fontSize: "26px",
    color: "var(--text)",
    marginBottom: "6px",
  },
  sub: {
    fontSize: "14px",
    color: "var(--muted)",
    marginBottom: "28px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--muted)",
    marginBottom: "7px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    marginBottom: "18px",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s",
  },
  error: {
    background: "rgba(255,92,92,0.08)",
    border: "1px solid rgba(255,92,92,0.25)",
    color: "#FF7070",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "var(--accent)",
    color: "#0E0E11",
    border: "none",
    borderRadius: "10px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px",
    marginBottom: "24px",
    transition: "opacity 0.2s",
  },
  bottom: {
    textAlign: "center",
    fontSize: "14px",
    color: "var(--muted)",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
}

export default Register