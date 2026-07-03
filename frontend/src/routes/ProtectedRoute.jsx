import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4 text-slate-300">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-8 py-6 text-sm shadow-soft">
          <div className="h-4 w-4 animate-pulse rounded-full bg-sky-400"></div>
          Checking authentication...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
