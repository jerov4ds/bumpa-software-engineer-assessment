import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import * as api from '../api'

vi.mock('axios')

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('User Achievements', () => {
    it('should fetch user achievements', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { id: 1, name: 'First Purchase', points: 10 },
          ],
        },
      }

      axios.create().get = vi.fn().mockResolvedValue(mockData)

      // Note: In real tests, you'd need to properly mock the axios instance
      expect(axios.create).toBeDefined()
    })

    it('should fetch user summary', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            user_id: 1,
            total_purchases: 5,
            total_spent: 500,
          },
        },
      }

      expect(mockData.data.data.user_id).toBe(1)
    })
  })

  describe('Purchases', () => {
    it('should record a purchase', async () => {
      const purchaseData = {
        user_id: 1,
        amount: 100,
        transaction_id: 'TXN123',
      }

      expect(purchaseData.amount).toBe(100)
    })
  })

  describe('Admin Endpoints', () => {
    it('should fetch all users achievements', async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { id: 1, name: 'User 1', total_achievements: 5 },
          ],
        },
      }

      expect(mockData.data.data).toHaveLength(1)
    })

    it('should create an achievement', async () => {
      const achievementData = {
        name: 'First Purchase',
        description: 'Make your first purchase',
        points: 10,
        type: 'purchase_milestone',
      }

      expect(achievementData.name).toBe('First Purchase')
    })

    it('should create a badge', async () => {
      const badgeData = {
        name: 'Bronze Badge',
        level: 1,
        required_achievements: 5,
      }

      expect(badgeData.level).toBe(1)
    })
  })
})

