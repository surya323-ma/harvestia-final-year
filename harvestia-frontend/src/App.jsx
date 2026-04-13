import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

// Layouts
import AppLayout  from '@components/layout/AppLayout'

// Public pages
import LandingPage  from '@pages/LandingPage'
import LoginPage    from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'

// Protected pages
import DashboardPage   from '@pages/DashboardPage'
import FieldsPage      from '@pages/FieldsPage'
import CropsPage       from '@pages/CropsPage'
import YieldAIPage     from '@pages/YieldAIPage'
import DiseaseAIPage   from '@pages/DiseaseAIPage'
import IrrigationAIPage from '@pages/IrrigationAIPage'
import PestAIPage      from '@pages/PestAIPage'
import SoilAIPage      from '@pages/SoilAIPage'
import MarketPage      from '@pages/MarketPage'
import AlertsPage      from '@pages/AlertsPage'
import ReportsPage     from '@pages/ReportsPage'
import SettingsPage    from '@pages/SettingsPage'
import StorePage       from '@pages/StorePage'


/* ── Route guard ── */
function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected — wrapped in AppLayout (sidebar + topbar) */}
      <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index               element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardPage />} />
        <Route path="fields"       element={<FieldsPage />} />
        <Route path="crops"        element={<CropsPage />} />
        <Route path="ai/yield"     element={<YieldAIPage />} />
        <Route path="ai/disease"   element={<DiseaseAIPage />} />
        <Route path="ai/irrigation"element={<IrrigationAIPage />} />
        <Route path="ai/pest"      element={<PestAIPage />} />
        <Route path="ai/soil"      element={<SoilAIPage />} />
        <Route path="market"       element={<MarketPage />} />
        <Route path="store"        element={<StorePage />} />
        <Route path="alerts"       element={<AlertsPage />} />
        <Route path="reports"      element={<ReportsPage />} />
        <Route path="settings"     element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
