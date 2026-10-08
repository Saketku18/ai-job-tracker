import axios from "axios"

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000/api"
  }
  return "https://jobtrack-backend-lc3f.onrender.com/api"
}

const API = axios.create({
  baseURL: getBaseURL(),
})

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`
  }
  return config
})

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)


export default API