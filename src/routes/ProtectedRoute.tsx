import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '@/features/auth/tokenStorage'

export function ProtectedRoute() {
  const isLoggedIn = !!getAccessToken()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}
