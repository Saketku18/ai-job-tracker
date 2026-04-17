import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/dashboard"
import AIAnalyzer from "./pages/AIAnalyzer"

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/analyzer" element={
  <ProtectedRoute><AIAnalyzer /></ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App