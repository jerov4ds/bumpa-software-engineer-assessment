import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  getAllUsersAchievements,
  getUserAchievementsAdmin,
  listAchievements,
  createAchievement,
  listBadges,
  createBadge,
} from '../services/api'
import './AdminPanel.css'

export default function AdminPanel() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [achievements, setAchievements] = useState([])
  const [badges, setBadges] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAchievementForm, setShowAchievementForm] = useState(false)
  const [showBadgeForm, setShowBadgeForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [achievementForm, setAchievementForm] = useState({
    name: '',
    description: '',
    icon: '🏆',
    points: 10,
    type: 'purchase_milestone',
    criteria: JSON.stringify({ min_purchases: 1 }),
  })

  const [badgeForm, setBadgeForm] = useState({
    name: '',
    description: '',
    icon: '⭐',
    level: 1,
    required_achievements: 5,
    required_points: 50,
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (activeTab === 'users') {
        const response = await getAllUsersAchievements()
        setUsers(response.data.data)
      } else if (activeTab === 'achievements') {
        const response = await listAchievements()
        setAchievements(response.data.data)
      } else if (activeTab === 'badges') {
        const response = await listBadges()
        setBadges(response.data.data)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = async (user) => {
    try {
      setSelectedUser(user)
      const response = await getUserAchievementsAdmin(user.id)
      setUserDetails(response.data.data)
    } catch (err) {
      setError('Failed to load user details')
      console.error(err)
    }
  }

  const handleCreateAchievement = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await createAchievement({
        ...achievementForm,
        criteria: JSON.parse(achievementForm.criteria),
      })
      setShowAchievementForm(false)
      setAchievementForm({
        name: '',
        description: '',
        icon: '🏆',
        points: 10,
        type: 'purchase_milestone',
        criteria: JSON.stringify({ min_purchases: 1 }),
      })
      await fetchData()
    } catch (err) {
      setError('Failed to create achievement')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateBadge = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await createBadge(badgeForm)
      setShowBadgeForm(false)
      setBadgeForm({
        name: '',
        description: '',
        icon: '⭐',
        level: 1,
        required_achievements: 5,
        required_points: 50,
      })
      await fetchData()
    } catch (err) {
      setError('Failed to create badge')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <nav className="admin-nav">
        <button
          className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`nav-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`nav-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
      </nav>

      <main className="admin-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'users' && (
          <section className="users-section">
            <h2>Customer Achievements</h2>
            {loading ? (
              <p className="loading">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="empty-state">No users found.</p>
            ) : (
              <div className="users-layout">
                <div className="users-list">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Achievements</th>
                        <th>Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className={selectedUser?.id === user.id ? 'selected' : ''}
                        >
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.total_achievements}</td>
                          <td>{user.current_badge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {userDetails && (
                  <div className="user-details">
                    <h3>{userDetails.name}</h3>
                    <p className="email">{userDetails.email}</p>

                    <div className="details-section">
                      <h4>Achievements ({userDetails.achievements.length})</h4>
                      {userDetails.achievements.length === 0 ? (
                        <p className="empty-state">No achievements</p>
                      ) : (
                        <div className="details-list">
                          {userDetails.achievements.map((achievement) => (
                            <div key={achievement.id} className="detail-item">
                              <span className="icon">{achievement.icon}</span>
                              <div>
                                <strong>{achievement.name}</strong>
                                <p>{achievement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="details-section">
                      <h4>Badges ({userDetails.badges.length})</h4>
                      {userDetails.badges.length === 0 ? (
                        <p className="empty-state">No badges</p>
                      ) : (
                        <div className="details-list">
                          {userDetails.badges.map((badge) => (
                            <div key={badge.id} className="detail-item">
                              <span className="icon">{badge.icon}</span>
                              <div>
                                <strong>{badge.name}</strong>
                                <p>{badge.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'achievements' && (
          <section className="achievements-section">
            <div className="section-header">
              <h2>Achievements ({achievements.length})</h2>
              <button
                onClick={() => setShowAchievementForm(!showAchievementForm)}
                className="primary-button"
              >
                {showAchievementForm ? 'Cancel' : '+ New Achievement'}
              </button>
            </div>

            {showAchievementForm && (
              <form onSubmit={handleCreateAchievement} className="form-card">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={achievementForm.name}
                      onChange={(e) =>
                        setAchievementForm({ ...achievementForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Icon</label>
                    <input
                      type="text"
                      value={achievementForm.icon}
                      onChange={(e) =>
                        setAchievementForm({ ...achievementForm, icon: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={achievementForm.description}
                    onChange={(e) =>
                      setAchievementForm({ ...achievementForm, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      value={achievementForm.points}
                      onChange={(e) =>
                        setAchievementForm({ ...achievementForm, points: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={achievementForm.type}
                      onChange={(e) =>
                        setAchievementForm({ ...achievementForm, type: e.target.value })
                      }
                    >
                      <option value="purchase_milestone">Purchase Milestone</option>
                      <option value="referral">Referral</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Criteria (JSON)</label>
                  <textarea
                    value={achievementForm.criteria}
                    onChange={(e) =>
                      setAchievementForm({ ...achievementForm, criteria: e.target.value })
                    }
                    required
                  />
                </div>

                <button type="submit" disabled={submitting} className="submit-button">
                  {submitting ? 'Creating...' : 'Create Achievement'}
                </button>
              </form>
            )}

            {loading ? (
              <p className="loading">Loading achievements...</p>
            ) : achievements.length === 0 ? (
              <p className="empty-state">No achievements yet.</p>
            ) : (
              <div className="achievements-grid">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="icon">{achievement.icon}</div>
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                    <div className="meta">
                      <span>{achievement.points} pts</span>
                      <span>{achievement.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'badges' && (
          <section className="badges-section">
            <div className="section-header">
              <h2>Badges ({badges.length})</h2>
              <button
                onClick={() => setShowBadgeForm(!showBadgeForm)}
                className="primary-button"
              >
                {showBadgeForm ? 'Cancel' : '+ New Badge'}
              </button>
            </div>

            {showBadgeForm && (
              <form onSubmit={handleCreateBadge} className="form-card">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={badgeForm.name}
                      onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Icon</label>
                    <input
                      type="text"
                      value={badgeForm.icon}
                      onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={badgeForm.description}
                    onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Level</label>
                    <input
                      type="number"
                      value={badgeForm.level}
                      onChange={(e) => setBadgeForm({ ...badgeForm, level: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Required Achievements</label>
                    <input
                      type="number"
                      value={badgeForm.required_achievements}
                      onChange={(e) =>
                        setBadgeForm({ ...badgeForm, required_achievements: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Required Points</label>
                    <input
                      type="number"
                      value={badgeForm.required_points}
                      onChange={(e) =>
                        setBadgeForm({ ...badgeForm, required_points: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="submit-button">
                  {submitting ? 'Creating...' : 'Create Badge'}
                </button>
              </form>
            )}

            {loading ? (
              <p className="loading">Loading badges...</p>
            ) : badges.length === 0 ? (
              <p className="empty-state">No badges yet.</p>
            ) : (
              <div className="badges-grid">
                {badges.map((badge) => (
                  <div key={badge.id} className="badge-item">
                    <div className="icon">{badge.icon}</div>
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                    <div className="meta">
                      <span>Level {badge.level}</span>
                      <span>{badge.required_achievements} achievements</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

