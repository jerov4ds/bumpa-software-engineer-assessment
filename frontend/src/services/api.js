import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// User Achievements
export const getUserAchievements = (userId) => {
  return api.get(`/users/${userId}/achievements`)
}

export const getUserSummary = (userId) => {
  return api.get(`/users/${userId}/summary`)
}

// Purchases
export const recordPurchase = (data) => {
  return api.post('/purchases', data)
}

// Admin - Users
export const getAllUsersAchievements = () => {
  return api.get('/admin/users/achievements')
}

export const getUserAchievementsAdmin = (userId) => {
  return api.get(`/admin/users/${userId}/achievements`)
}

// Admin - Achievements
export const listAchievements = () => {
  return api.get('/admin/achievements')
}

export const createAchievement = (data) => {
  return api.post('/admin/achievements', data)
}

// Admin - Badges
export const listBadges = () => {
  return api.get('/admin/badges')
}

export const createBadge = (data) => {
  return api.post('/admin/badges', data)
}

export default api

