import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
export const uploadResume = (formData) =>
  API.post("/ai/upload", formData);

export const extractJob = (text) =>
  API.post("/ai/extract", { text });

export const matchResume = () =>
  API.post("/ai/match");

export const getAdvice = () =>
  API.post("/ai/advise");

export default API