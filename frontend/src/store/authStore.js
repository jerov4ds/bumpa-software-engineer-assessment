import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userRole: null,
  userId: null,
  userName: null,

  login: (userId, userName, userRole) => {
    set({
      isAuthenticated: true,
      userId,
      userName,
      userRole,
    })
    localStorage.setItem('auth', JSON.stringify({ userId, userName, userRole }))
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userRole: null,
      userId: null,
      userName: null,
    })
    localStorage.removeItem('auth')
  },

  restoreAuth: () => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      const { userId, userName, userRole } = JSON.parse(auth)
      set({
        isAuthenticated: true,
        userId,
        userName,
        userRole,
      })
    }
  },
}))

