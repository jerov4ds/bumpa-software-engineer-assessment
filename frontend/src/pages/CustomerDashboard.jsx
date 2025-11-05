import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getUserSummary, recordPurchase } from '../services/api'
import './Dashboard.css'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { userId, userName, logout } = useAuthStore()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [purchaseData, setPurchaseData] = useState({
    amount: '',
    paymentMethod: 'credit_card',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUserSummary()
  }, [userId])

  const fetchUserSummary = async () => {
    try {
      setLoading(true)
      const response = await getUserSummary(userId)
      setSummary(response.data.data)
      setError(null)
    } catch (err) {
      setError('Failed to load loyalty summary')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault()
    if (!purchaseData.amount || parseFloat(purchaseData.amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setSubmitting(true)
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await recordPurchase({
        user_id: userId,
        amount: parseFloat(purchaseData.amount),
        transaction_id: transactionId,
        payment_method: purchaseData.paymentMethod,
      })

      setShowPurchaseForm(false)
      setPurchaseData({ amount: '', paymentMethod: 'credit_card' })
      setError(null)

      // Refresh summary
      await fetchUserSummary()
    } catch (err) {
      setError('Failed to record purchase')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎯 Loyalty Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, {userName}!</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Loading your loyalty summary...</p>
        ) : summary ? (
          <>
            <section className="summary-section">
              <div className="summary-card">
                <h3>Total Purchases</h3>
                <p className="summary-value">{summary.total_purchases}</p>
              </div>
              <div className="summary-card">
                <h3>Total Spent</h3>
                <p className="summary-value">${summary.total_spent.toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Cashback Earned</h3>
                <p className="summary-value">${summary.total_cashback.toFixed(2)}</p>
              </div>
              <div className="summary-card">
                <h3>Current Badge</h3>
                <p className="summary-value">{summary.current_badge}</p>
              </div>
            </section>

            <section className="achievements-section">
              <div className="section-header">
                <h2>Your Achievements ({summary.achievements_count})</h2>
                <button
                  onClick={() => setShowPurchaseForm(!showPurchaseForm)}
                  className="primary-button"
                >
                  {showPurchaseForm ? 'Cancel' : '+ Record Purchase'}
                </button>
              </div>

              {showPurchaseForm && (
                <form onSubmit={handlePurchaseSubmit} className="purchase-form">
                  <div className="form-group">
                    <label htmlFor="amount">Purchase Amount ($)</label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={purchaseData.amount}
                      onChange={(e) => setPurchaseData({ ...purchaseData, amount: e.target.value })}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                      id="paymentMethod"
                      value={purchaseData.paymentMethod}
                      onChange={(e) => setPurchaseData({ ...purchaseData, paymentMethod: e.target.value })}
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <button type="submit" disabled={submitting} className="submit-button">
                    {submitting ? 'Processing...' : 'Record Purchase'}
                  </button>
                </form>
              )}

              {summary.achievements_count === 0 ? (
                <p className="empty-state">No achievements yet. Start making purchases to unlock achievements!</p>
              ) : (
                <div className="achievements-grid">
                  {summary.achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card">
                      <div className="achievement-icon">{achievement.icon}</div>
                      <h3>{achievement.name}</h3>
                      <p>{achievement.description}</p>
                      <div className="achievement-meta">
                        <span className="points">+{achievement.points} pts</span>
                        <span className="date">{new Date(achievement.unlocked_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="badges-section">
              <h2>Your Badges ({summary.badges_count})</h2>
              {summary.badges_count === 0 ? (
                <p className="empty-state">No badges yet. Unlock more achievements to earn badges!</p>
              ) : (
                <div className="badges-grid">
                  {summary.badges.map((badge) => (
                    <div key={badge.id} className="badge-card">
                      <div className="badge-icon">{badge.icon}</div>
                      <h3>{badge.name}</h3>
                      <p>{badge.description}</p>
                      <span className="badge-level">Level {badge.level}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <p className="empty-state">No data available</p>
        )}
      </main>
    </div>
  )
}

