import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './i18n/i18n'
import { AuthProvider } from '@/lib/auth'
import { AuthModalProvider } from '@/lib/auth-modal'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import App from './App.tsx'
import Vehicules from './pages/Vehicules.tsx'
import VehiculeDetail from './pages/VehiculeDetail.tsx'
import Dashboard from './pages/Dashboard.tsx'
import DashboardHome from './pages/DashboardHome.tsx'
import DashboardReservations from './pages/DashboardReservations.tsx'
import DashboardCars from './pages/DashboardCars.tsx'
import DashboardCarForm from './pages/DashboardCarForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/vehicules" element={<Vehicules />} />
          <Route path="/vehicules/:slug" element={<VehiculeDetail />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="reservations" element={<DashboardReservations />} />
            <Route path="cars" element={<DashboardCars />} />
            <Route path="cars/new" element={<DashboardCarForm />} />
            <Route path="cars/:slug/edit" element={<DashboardCarForm />} />
          </Route>
        </Routes>
        </AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
