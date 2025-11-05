import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminPanel from '../AdminPanel'
import * as api from '../../services/api'

vi.mock('../../services/api')
vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    logout: vi.fn(),
  }),
}))

describe('AdminPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render admin header', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument()
    })
  })

  it('should display navigation tabs', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Achievements')).toBeInTheDocument()
      expect(screen.getByText('Badges')).toBeInTheDocument()
    })
  })

  it('should load users on mount', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: 'User 1', email: 'user1@test.com', total_achievements: 5 },
        ],
      },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(api.getAllUsersAchievements).toHaveBeenCalled()
    })
  })

  it('should switch to achievements tab', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })
    api.listAchievements.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      const achievementsTab = screen.getByText('Achievements')
      fireEvent.click(achievementsTab)
    })

    await waitFor(() => {
      expect(api.listAchievements).toHaveBeenCalled()
    })
  })

  it('should switch to badges tab', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })
    api.listBadges.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      const badgesTab = screen.getByText('Badges')
      fireEvent.click(badgesTab)
    })

    await waitFor(() => {
      expect(api.listBadges).toHaveBeenCalled()
    })
  })

  it('should display user details when user is selected', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: {
        data: [
          { id: 1, name: 'User 1', email: 'user1@test.com', total_achievements: 1 },
        ],
      },
    })
    api.getUserAchievementsAdmin.mockResolvedValue({
      data: {
        data: {
          user_id: 1,
          name: 'User 1',
          email: 'user1@test.com',
          achievements: [
            { id: 1, name: 'First Purchase', icon: '🎉' },
          ],
          badges: [],
        },
      },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      const userRow = screen.getByText('User 1')
      fireEvent.click(userRow)
    })

    await waitFor(() => {
      expect(api.getUserAchievementsAdmin).toHaveBeenCalledWith(1)
    })
  })

  it('should show achievement creation form', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })
    api.listAchievements.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      const achievementsTab = screen.getByText('Achievements')
      fireEvent.click(achievementsTab)
    })

    await waitFor(() => {
      const newButton = screen.getByText(/New Achievement/i)
      fireEvent.click(newButton)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    })
  })

  it('should show badge creation form', async () => {
    api.getAllUsersAchievements.mockResolvedValue({
      data: { data: [] },
    })
    api.listBadges.mockResolvedValue({
      data: { data: [] },
    })

    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    )

    await waitFor(() => {
      const badgesTab = screen.getByText('Badges')
      fireEvent.click(badgesTab)
    })

    await waitFor(() => {
      const newButton = screen.getByText(/New Badge/i)
      fireEvent.click(newButton)
    })

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    })
  })
})

