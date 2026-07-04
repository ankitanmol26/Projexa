import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

// Eagerly loaded — critical path
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import NotFound from '../pages/NotFound.jsx'
import Unauthorized from '../pages/Unauthorized.jsx'
import ProjectPage from '../pages/ProjectPage.jsx'

// Lazy loaded — code split per route
const Dashboard    = lazy(() => import('../pages/Dashboard.jsx'))
const MyProjects   = lazy(() => import('../pages/MyProjects.jsx'))
const CreateProject = lazy(() => import('../pages/CreateProject.jsx'))
const EditProject  = lazy(() => import('../pages/EditProject.jsx'))
const Profile      = lazy(() => import('../pages/Profile.jsx'))
const Bookmarks    = lazy(() => import('../pages/Bookmarks.jsx'))
const Settings     = lazy(() => import('../pages/Settings.jsx'))
const Notifications = lazy(() => import('../pages/Notifications.jsx'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'))
const ResetPassword  = lazy(() => import('../pages/ResetPassword.jsx'))

// Page loading fallback — matches the app's skeleton style
function PageLoader() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 skeleton rounded-lg" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[1,2,3].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
      </div>
      <div className="h-64 skeleton rounded-xl" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ── Public ─────────────────────────────────────────────────── */}
        <Route index element={<Home />} />
        <Route path="login"            element={<Login />} />
        <Route path="register"         element={<Register />} />
        <Route path="unauthorized"     element={<Unauthorized />} />
        <Route path="forgot-password"  element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
        <Route path="reset-password/:token" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />

        {/* Public project detail */}
        <Route path="projects/:id" element={<ProjectPage />} />

        {/* ── Protected ──────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard"       element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="my-projects"     element={<Suspense fallback={<PageLoader />}><MyProjects /></Suspense>} />
          <Route path="projects/create" element={<Suspense fallback={<PageLoader />}><CreateProject /></Suspense>} />
          <Route path="projects/:id/edit" element={<Suspense fallback={<PageLoader />}><EditProject /></Suspense>} />
          <Route path="profile"         element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
          <Route path="bookmarks"       element={<Suspense fallback={<PageLoader />}><Bookmarks /></Suspense>} />
          <Route path="notifications"   element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
          <Route path="settings"        element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
