import { create } from 'zustand'
import api from '../services/api'

const useStore = create((set, get) => ({
  // Auth
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const user = res.data
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
    return user
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const user = res.data
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
    return user
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null, applications: [] })
  },

  // Applications
  applications: [],
  loading: false,
  error: null,

  fetchApplications: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/applications')
      set({ applications: res.data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', loading: false })
    }
  },

  addApplication: async (data) => {
    const res = await api.post('/applications', data)
    set((state) => ({ applications: [...state.applications, res.data] }))
    return res.data
  },

  updateApplication: async (id, data) => {
    const res = await api.put(`/applications/${id}`, data)
    set((state) => ({
      applications: state.applications.map((a) => (a._id === id ? res.data : a)),
    }))
    return res.data
  },

  deleteApplication: async (id) => {
    await api.delete(`/applications/${id}`)
    set((state) => ({
      applications: state.applications.filter((a) => a._id !== id),
    }))
  },
}))

export default useStore