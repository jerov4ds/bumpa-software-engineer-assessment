import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CustomerDashboard from '../CustomerDashboard'
import * as api from '../../services/api'

vi.mock('../../services/api')
vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    userId: 1,
    userName: 'Test User',
    logout: vi.fn(),
  }),
}))

describe('CustomerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard header', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 0,
          total_spent: 0,
          total_cashback: 0,
          current_badge: 'None',
          achievements_count: 0,
          badges_count: 0,
          achievements: [],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Loyalty Dashboard/i)).toBeInTheDocument()
      expect(screen.getByText(/Welcome, Test User!/i)).toBeInTheDocument()
    })
  })

  it('should display summary cards', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 5,
          total_spent: 500,
          total_cashback: 10,
          current_badge: 'Gold',
          achievements_count: 3,
          badges_count: 1,
          achievements: [],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Total Purchases')).toBeInTheDocument()
      expect(screen.getByText('Total Spent')).toBeInTheDocument()
      expect(screen.getByText('Cashback Earned')).toBeInTheDocument()
      expect(screen.getByText('Current Badge')).toBeInTheDocument()
    })
  })

  it('should show empty state when no achievements', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 0,
          total_spent: 0,
          total_cashback: 0,
          current_badge: 'None',
          achievements_count: 0,
          badges_count: 0,
          achievements: [],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No achievements yet/i)).toBeInTheDocument()
    })
  })

  it('should display achievements when available', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 1,
          total_spent: 100,
          total_cashback: 2,
          current_badge: 'None',
          achievements_count: 1,
          badges_count: 0,
          achievements: [
            {
              id: 1,
              name: 'First Purchase',
              description: 'Make your first purchase',
              icon: '🎉',
              points: 10,
              unlocked_at: '2024-01-01',
            },
          ],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('First Purchase')).toBeInTheDocument()
      expect(screen.getByText('Make your first purchase')).toBeInTheDocument()
    })
  })

  it('should show purchase form when button is clicked', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 0,
          total_spent: 0,
          total_cashback: 0,
          current_badge: 'None',
          achievements_count: 0,
          badges_count: 0,
          achievements: [],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      const button = screen.getByText(/Record Purchase/i)
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/Purchase Amount/i)).toBeInTheDocument()
    })
  })

  it('should handle logout', async () => {
    api.getUserSummary.mockResolvedValue({
      data: {
        data: {
          total_purchases: 0,
          total_spent: 0,
          total_cashback: 0,
          current_badge: 'None',
          achievements_count: 0,
          badges_count: 0,
          achievements: [],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <CustomerDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      const logoutButton = screen.getByText('Logout')
      expect(logoutButton).toBeInTheDocument()
    })
  })
})

