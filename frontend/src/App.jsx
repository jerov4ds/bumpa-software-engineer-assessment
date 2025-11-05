import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminPanel from './pages/AdminPanel'
import './App.css'

function App() {
  const { isAuthenticated, userRole } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated && userRole === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? (userRole === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
      </Routes>
    </Router>
  )
}

export default App

