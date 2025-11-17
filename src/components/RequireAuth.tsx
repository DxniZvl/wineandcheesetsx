// src/components/RequireAuth.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../auth'

interface RequireAuthProps {
  adminOnly?: boolean
}

export default function RequireAuth({ adminOnly }: RequireAuthProps) {
  const user = getCurrentUser()

  // No logged user → send to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged but not admin and route is admin-only → send to home
  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
