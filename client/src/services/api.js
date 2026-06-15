import axios from "axios"

const API = axios.create({
 baseURL: "https://jobtrack-backend-lc3f.onrender.com/api",}
)

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
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)


export default API