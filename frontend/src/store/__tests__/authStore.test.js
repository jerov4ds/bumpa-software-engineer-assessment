import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should initialize with default state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.userId).toBeNull()
    expect(store.userName).toBeNull()
    expect(store.userRole).toBeNull()
  })

  it('should login a user', () => {
    const store = useAuthStore()
    
    store.login('John Doe', 'customer', 1)
    
    expect(store.isAuthenticated).toBe(true)
    expect(store.userName).toBe('John Doe')
    expect(store.userRole).toBe('customer')
    expect(store.userId).toBe(1)
  })

  it('should logout a user', () => {
    const store = useAuthStore()
    
    store.login('John Doe', 'customer', 1)
    expect(store.isAuthenticated).toBe(true)
    
    store.logout()
    
    expect(store.isAuthenticated).toBe(false)
    expect(store.userName).toBeNull()
    expect(store.userRole).toBeNull()
    expect(store.userId).toBeNull()
  })

  it('should persist auth state to localStorage', () => {
    const store = useAuthStore()
    
    store.login('Jane Doe', 'admin', 2)
    
    const stored = JSON.parse(localStorage.getItem('auth-store'))
    expect(stored.state.isAuthenticated).toBe(true)
    expect(stored.state.userName).toBe('Jane Doe')
  })

  it('should restore auth state from localStorage', () => {
    // Set up localStorage with auth data
    const authData = {
      state: {
        isAuthenticated: true,
        userId: 3,
        userName: 'Test User',
        userRole: 'customer',
      },
    }
    localStorage.setItem('auth-store', JSON.stringify(authData))
    
    const store = useAuthStore()
    store.restoreAuth()
    
    expect(store.isAuthenticated).toBe(true)
    expect(store.userName).toBe('Test User')
  })

  it('should distinguish between customer and admin roles', () => {
    const store = useAuthStore()
    
    store.login('Admin User', 'admin', 1)
    expect(store.userRole).toBe('admin')
    
    store.logout()
    
    store.login('Customer User', 'customer', 2)
    expect(store.userRole).toBe('customer')
  })
})

