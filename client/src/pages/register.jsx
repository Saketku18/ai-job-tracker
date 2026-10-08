import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    if (e) e.preventDefault()
    if (!name || !email || !password) {
      setError("Please fill in your name, email, and password")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/register", { name, email, password })
      localStorage.clear()
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
      <div style={s.ambientGlow} />

      <div style={s.card}>
        {/* Brand Header */}
        <div style={s.logoRow}>
          <div style={s.logoBox}>JT</div>
          <div>
            <div style={s.logoText}>JobTrack</div>
            <div style={s.logoBadge}>AI Career Tracker</div>
          </div>
        </div>

        <h2 style={s.title}>Create your account</h2>
        <p style={s.sub}>Track every job application and score your resume with AI</p>

        {error && (
          <div style={s.error}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Full Name field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={s.label}>Full Name</label>
            <div style={s.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={s.input}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={s.label}>Email Address</label>
            <div style={s.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "22px" }}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={s.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...s.input, paddingRight: "42px" }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={s.eyeBtn}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span className="spinner" style={{ width: "16px", height: "16px", borderTopColor: "#0E0E11", borderColor: "rgba(14,14,17,0.2)" }} />
                Creating account...
              </span>
            ) : (
              "Create account →"
            )}
          </button>
        </form>

        <p style={s.bottom}>
          Already have an account?{" "}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>

        {/* Feature Highlights Footer */}
        <div style={s.featureFooter}>
          <div style={s.featureTag}>✓ Kanban Tracking</div>
          <div style={s.featureTag}>✓ ATS Matcher</div>
          <div style={s.featureTag}>✓ AI Career Advice</div>
        </div>
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
    padding: "24px 20px",
    position: "relative",
    overflow: "hidden",
  },
  ambientGlow: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(232, 255, 71, 0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "22px",
    padding: "38px 34px",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
    position: "relative",
    zIndex: 1,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "26px",
  },
  logoBox: {
    width: "40px",
    height: "40px",
    background: "var(--accent)",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: "15px",
    color: "#0E0E11",
    boxShadow: "0 4px 12px rgba(232, 255, 71, 0.25)",
  },
  logoText: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "19px",
    color: "var(--text)",
    lineHeight: 1.1,
  },
  logoBadge: {
    fontSize: "11px",
    color: "var(--muted)",
    fontWeight: 500,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "var(--text)",
    fontFamily: "Syne, sans-serif",
    marginBottom: "6px",
    letterSpacing: "-0.02em",
  },
  sub: {
    fontSize: "13.5px",
    color: "var(--muted)",
    marginBottom: "24px",
    lineHeight: 1.45,
  },
  label: {
    display: "block",
    fontSize: "11.5px",
    fontWeight: 600,
    color: "var(--muted)",
    marginBottom: "7px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: "11px",
    color: "var(--text)",
    fontSize: "13.5px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.15s ease",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    color: "var(--muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#F87171",
    padding: "11px 14px",
    borderRadius: "11px",
    fontSize: "13px",
    marginBottom: "18px",
    lineHeight: 1.4,
  },
  btn: {
    width: "100%",
    padding: "13px",
    background: "var(--accent)",
    color: "#0E0E11",
    border: "none",
    borderRadius: "11px",
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: "14.5px",
    cursor: "pointer",
    marginTop: "4px",
    marginBottom: "20px",
    boxShadow: "0 4px 14px rgba(232, 255, 71, 0.25)",
    transition: "opacity 0.15s ease, transform 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    textAlign: "center",
    fontSize: "13.5px",
    color: "var(--muted)",
    margin: 0,
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
  featureFooter: {
    marginTop: "26px",
    paddingTop: "20px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  featureTag: {
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--muted)",
    background: "var(--bg3)",
    padding: "3px 8px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
  },
}

export default Register