$files = @{
  'package.json' = @'
{
  "name": "projexa-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "axios": "^1.18.1",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-router-dom": "^7.18.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.3",
    "autoprefixer": "^10.4.19",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.1"
  }
}
'@
  '.env' = @'
VITE_API_BASE_URL=http://localhost:5000/api/v1
'@
  'tailwind.config.js' = @'
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.14)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(99, 102, 241, 0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.18), transparent 30%)',
      },
    },
  },
  plugins: [],
}
'@
  'postcss.config.js' = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
  'src/main.jsx' = @'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
'@
  'src/App.jsx' = @'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return <AppRoutes />
}

export default App
'@
  'src/index.css' = '@import "./styles/globals.css"'
  'src/styles/globals.css' = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #020617;
  color: #e2e8f0;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  margin: 0;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 25%),
    linear-gradient(180deg, #020617 0%, #020617 46%, #0f172a 100%);
}

* {
  box-sizing: border-box;
}

#root {
  min-height: 100vh;
}

::selection {
  background: rgba(99, 102, 241, 0.24);
  color: white;
}

@layer components {
  .glass-card {
    @apply rounded-[32px] border border-white/10 bg-slate-950/70 shadow-soft backdrop-blur-xl;
  }

  .surface-card {
    @apply rounded-3xl bg-slate-950/80 border border-white/10 shadow-soft;
  }

  .primary-button {
    @apply inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400;
  }

  .secondary-button {
    @apply inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 transition duration-300 ease-out hover:border-slate-400 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500;
  }

  .input-field {
    @apply w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20;
  }

  .card-title {
    @apply text-lg font-semibold tracking-tight text-slate-100;
  }

  .card-text {
    @apply text-sm leading-6 text-slate-300;
  }

  .tag-pill {
    @apply inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5;
  }

  .section-heading {
    @apply text-3xl font-semibold tracking-tight text-white sm:text-4xl;
  }

  .animated-glow {
    @apply animate-pulse/75 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent;
  }
}
'@
  'src/routes/AppRoutes.jsx' = @'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import MyProjects from '../pages/MyProjects.jsx'
import CreateProject from '../pages/CreateProject.jsx'
import EditProject from '../pages/EditProject.jsx'
import ProjectPage from '../pages/ProjectPage.jsx'
import Profile from '../pages/Profile.jsx'
import NotFound from '../pages/NotFound.jsx'
import Unauthorized from '../pages/Unauthorized.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id/edit" element={<EditProject />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
'@
  'src/routes/ProtectedRoute.jsx' = @'
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
'@
  'src/context/AuthContext.jsx' = @'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest, register as registerRequest, getMe } from '../api/authApi.js'
import { registerUnauthorizedHandler, setAuthToken } from '../api/axios.js'
import * as storage from '../utils/storage.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(storage.getToken())
  const [loading, setLoading] = useState(Boolean(token))

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    storage.removeToken()
    setAuthToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    registerUnauthorizedHandler(logout)
  }, [logout])

  useEffect(() => {
    if (!token) {
      setAuthToken(null)
      setLoading(false)
      return
    }

    setAuthToken(token)
    setLoading(true)

    const loadProfile = async () => {
      try {
        const profile = await getMe()
        setUser(profile)
      } catch (error) {
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token, logout])

  const login = async (credentials) => {
    const response = await loginRequest(credentials)
    const accessToken = response?.token ?? response?.data?.token
    const currentUser = response?.user ?? response?.data?.user ?? response

    if (!accessToken) {
      throw new Error('Unable to authenticate')
    }

    storage.setToken(accessToken)
    setToken(accessToken)
    setUser(currentUser)
    setAuthToken(accessToken)
    return currentUser
  }

  const register = async (data) => {
    const response = await registerRequest(data)
    const accessToken = response?.token ?? response?.data?.token
    const currentUser = response?.user ?? response?.data?.user ?? response

    if (!accessToken) {
      throw new Error('Unable to register')
    }

    storage.setToken(accessToken)
    setToken(accessToken)
    setUser(currentUser)
    setAuthToken(accessToken)
    return currentUser
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
'@
  'src/hooks/useAuth.js' = @'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function useAuth() {
  return useContext(AuthContext)
}
'@
  'src/hooks/useAxios.js' = @'
import { useMemo } from 'react'
import apiClient from '../api/axios.js'

export default function useAxios() {
  return useMemo(() => apiClient, [])
}
'@
  'src/api/axios.js' = @'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

let logoutHandler = null

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

export const registerUnauthorizedHandler = (callback) => {
  logoutHandler = callback
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutHandler?.()
    }
    return Promise.reject(error)
  },
)

export default apiClient
'@
  'src/api/authApi.js' = @'
import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const register = (payload) => apiClient.post('/auth/register', payload).then(unwrap)
export const login = (payload) => apiClient.post('/auth/login', payload).then(unwrap)
export const getMe = () => apiClient.get('/auth/me').then(unwrap)
'@
  'src/api/projectApi.js' = @'
import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const getProjects = () => apiClient.get('/projects').then(unwrap)
export const getProject = (id) => apiClient.get(`/projects/${id}`).then(unwrap)
export const createProject = (payload) => apiClient.post('/projects', payload).then(unwrap)
export const updateProject = (id, payload) => apiClient.put(`/projects/${id}`, payload).then(unwrap)
export const deleteProject = (id) => apiClient.delete(`/projects/${id}`).then(unwrap)
export const getMyProjects = () => apiClient.get('/projects/my-projects').then(unwrap)
'@
  'src/api/commentApi.js' = @'
import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const getComments = (projectId) => apiClient.get(`/comments/project/${projectId}`).then(unwrap)
export const createComment = (projectId, payload) => apiClient.post(`/comments/project/${projectId}`, payload).then(unwrap)
export const updateComment = (commentId, payload) => apiClient.put(`/comments/${commentId}`, payload).then(unwrap)
export const deleteComment = (commentId) => apiClient.delete(`/comments/${commentId}`).then(unwrap)
'@
  'src/api/likeApi.js' = @'
import apiClient from './axios.js'

const unwrap = (response) => response.data?.data ?? response.data

export const toggleLike = (projectId) => apiClient.post(`/likes/${projectId}`).then(unwrap)
'@
  'src/utils/storage.js' = @'
const TOKEN_KEY = 'projexa_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
'@
  'src/utils/validators.js' = @'
export const isValidUrl = (value) => {
  try {
    if (!value) return true
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const validateAuthPayload = ({ email, password, name }) => {
  const errors = {}

  if (!name?.trim()) {
    errors.name = 'Name is required.'
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password?.trim()) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

export const validateProjectPayload = ({ title, description, githubUrl, liveDemoUrl }) => {
  const errors = {}

  if (!title?.trim()) errors.title = 'Project title is required.'
  if (!description?.trim()) errors.description = 'Project description is required.'
  if (githubUrl && !isValidUrl(githubUrl)) errors.githubUrl = 'Please enter a valid GitHub URL.'
  if (liveDemoUrl && !isValidUrl(liveDemoUrl)) errors.liveDemoUrl = 'Please enter a valid demo URL.'

  return errors
}
'@
  'src/utils/constants.js' = @'
export const DEFAULT_TECHNOLOGIES = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'JavaScript',
  'Tailwind',
  'GraphQL',
  'TypeScript',
]

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
'@
  'src/components/common/Button.jsx' = @'
export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    primary: 'primary-button',
    secondary: 'secondary-button',
    ghost: 'inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-slate-100 transition hover:text-white',
  }

  return (
    <button type="button" className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
'@
  'src/components/common/Input.jsx' = @'
export default function Input({ label, id, error, ...props }) {
  return (
    <label htmlFor={id} className="block text-left text-sm font-medium text-slate-200">
      {label}
      <input id={id} className="input-field mt-2" {...props} />
      {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}
    </label>
  )
}
'@
  'src/components/common/Loader.jsx' = @'
export default function Loader({ size = 12 }) {
  return (
    <div className="inline-flex items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-transparent"
        style={{ width: size * 2, height: size * 2 }}
      />
    </div>
  )
}
'@
  'src/components/common/Modal.jsx' = @'
export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500">
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  )
}
'@
  'src/components/common/EmptyState.jsx' = @'
import { Link } from 'react-router-dom'

export default function EmptyState({ title, description, actionLabel, actionUrl }) {
  return (
    <div className="glass-card flex min-h-[240px] flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="rounded-3xl bg-slate-900/90 px-5 py-4 text-2xl font-semibold text-slate-100">😌</div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {actionUrl ? (
        <Link to={actionUrl} className="primary-button">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}
'@
  'src/components/layout/Navbar.jsx' = @'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Projects', to: '/my-projects' },
  { label: 'Create', to: '/projects/create' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('projexa_theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('projexa_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-base font-black text-white shadow-lg shadow-sky-500/20">
            P
          </span>
          Projexa
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900/80 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="secondary-button"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleLogout} className="secondary-button">
                Logout
              </button>
              <Link to="/profile" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500">
                {user?.name?.split(' ')[0] || 'Me'}
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="secondary-button">
                Login
              </Link>
              <Link to="/register" className="primary-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
'@
  'src/components/layout/Footer.jsx' = @'
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-8 text-slate-400">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Projexa · Student project showcase platform</p>
        <p>Built with React, Vite, Tailwind, and Axios.</p>
      </div>
    </footer>
  )
}
'@
  'src/components/layout/Layout.jsx' = @'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
'@
  'src/components/layout/Sidebar.jsx' = @'
import { Link } from 'react-router-dom'

export default function Sidebar({ items = [] }) {
  return (
    <aside className="glass-card w-full max-w-sm space-y-4 p-6">
      <h2 className="text-lg font-semibold text-white">Quick links</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
'@
  'src/components/project/ProjectCard.jsx' = @'
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton.jsx'

export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.technologies) ? project.technologies : []
  const githubUrl = project.githubUrl || project.github || ''
  const demoUrl = project.liveDemoUrl || project.liveDemo || ''

  return (
    <article className="glass-card flex h-full flex-col overflow-hidden p-6">
      <div className="mb-5 h-48 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="flex h-full items-center justify-center text-center text-slate-500">
          <span className="text-sm uppercase tracking-[0.35em]">Project preview</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-sky-300">Student work</p>
          <h3 className="card-title">{project.title || 'Untitled project'}</h3>
          <p className="card-text mt-3 line-clamp-3">{project.description || 'A beautiful student showcase awaits.'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tech) => (
            <span key={tech} className="tag-pill">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="secondary-button">
                GitHub
              </a>
            ) : null}
            {demoUrl ? (
              <a href={demoUrl} target="_blank" rel="noreferrer" className="secondary-button">
                Live Demo
              </a>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <LikeButton count={project.likes?.length ?? project.likeCount ?? 0} />
            <Link to={`/projects/${project._id || project.id}`} className="secondary-button">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
'@
  'src/components/project/ProjectGrid.jsx' = @'
import ProjectCard from './ProjectCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function ProjectGrid({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="surface-card h-96 animate-pulse p-6" />
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="There are no projects matching your search yet. Create the first showcase project and invite others to explore it."
        actionLabel="Create a project"
        actionUrl="/projects/create"
      />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id || project.id} project={project} />
      ))}
    </div>
  )
}
'@
  'src/components/project/ProjectForm.jsx' = @'
import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import Input from '../common/Input.jsx'
import { validateProjectPayload } from '../../utils/validators.js'

const toCommaSeparated = (technologies = []) => technologies.join(', ')

export default function ProjectForm({ initialValue = {}, onSubmit, loading }) {
  const [values, setValues] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    imageUrl: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValue) {
      setValues({
        title: initialValue.title || '',
        description: initialValue.description || '',
        technologies: toCommaSeparated(initialValue.technologies || initialValue.techs || []),
        githubUrl: initialValue.githubUrl || initialValue.github || '',
        liveDemoUrl: initialValue.liveDemoUrl || initialValue.liveDemo || '',
        imageUrl: initialValue.imageUrl || '',
      })
    }
  }, [initialValue])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      title: values.title,
      description: values.description,
      githubUrl: values.githubUrl,
      liveDemoUrl: values.liveDemoUrl,
      imageUrl: values.imageUrl,
      technologies: values.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
    }
    const validation = validateProjectPayload(payload)
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setErrors({})
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8">
      <div>
        <h2 className="section-heading">Project details</h2>
        <p className="mt-3 text-sm text-slate-400">
          Add a compelling showcase project with repository links, live demo, and technologies.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Input id="title" name="title" label="Project title" value={values.title} onChange={handleChange} error={errors.title} />
        <Input id="githubUrl" name="githubUrl" label="GitHub URL" value={values.githubUrl} onChange={handleChange} error={errors.githubUrl} />
        <Input id="liveDemoUrl" name="liveDemoUrl" label="Live demo URL" value={values.liveDemoUrl} onChange={handleChange} error={errors.liveDemoUrl} />
        <Input id="imageUrl" name="imageUrl" label="Image URL" value={values.imageUrl} onChange={handleChange} />
      </div>

      <div className="space-y-4">
        <label htmlFor="description" className="block text-sm font-medium text-slate-200">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="5"
          className="input-field w-full resize-none"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe what makes this project special..."
        />
        {errors.description ? <p className="text-xs text-rose-400">{errors.description}</p> : null}
      </div>

      <div>
        <Input id="technologies" name="technologies" label="Technologies (comma separated)" value={values.technologies} onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="primary" type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading ? 'Saving...' : 'Save project'}
        </Button>
        <p className="text-sm text-slate-400">Tip: add 3–5 technologies that best describe this project.</p>
      </div>
    </form>
  )
}
'@
  'src/components/project/ProjectDetails.jsx' = @'
import LikeButton from './LikeButton.jsx'

const getOwnerName = (project) => project.owner?.name || project.creator?.name || project.ownerName || 'Student'

export default function ProjectDetails({ project, onLike, liked, commentsCount }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : []

  return (
    <section className="glass-card overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-soft">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">
              Featured project
            </span>
            <h1 className="section-heading">{project.title}</h1>
            <p className="text-base leading-7 text-slate-300">{project.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5">
              <h3 className="text-sm font-medium text-slate-400">Project owner</h3>
              <p className="mt-2 text-slate-100">{getOwnerName(project)}</p>
            </div>
            <div className="surface-card p-5">
              <h3 className="text-sm font-medium text-slate-400">Comments</h3>
              <p className="mt-2 text-slate-100">{commentsCount ?? project.comments?.length ?? 0}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <div className="flex flex-wrap items-center gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="tag-pill">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="secondary-button">
                    GitHub repo
                  </a>
                ) : null}
                {project.liveDemoUrl ? (
                  <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="secondary-button">
                    Live demo
                  </a>
                ) : null}
              </div>
              <LikeButton count={project.likes?.length ?? project.likeCount ?? 0} active={liked} onClick={onLike} />
            </div>
          </div>
        </div>

        <div className="surface-card flex flex-col justify-between gap-6 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Project snapshot</h3>
            <div className="space-y-2 text-sm leading-6 text-slate-300">
              <p>
                <span className="font-semibold text-slate-200">GitHub: </span>
                {project.githubUrl || 'Not provided'}
              </p>
              <p>
                <span className="font-semibold text-slate-200">Demo: </span>
                {project.liveDemoUrl || 'Not provided'}
              </p>
              <p>
                <span className="font-semibold text-slate-200">Technologies: </span>
                {technologies.length ? technologies.join(', ') : 'No technologies listed'}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Quick notes</p>
            <p className="mt-3 leading-6">
              Student showcases are more powerful when they share links, supporting notes, and an engaging summary.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
'@
  'src/components/project/LikeButton.jsx' = @'
export default function LikeButton({ count = 0, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? 'border-sky-400 bg-sky-500/10 text-sky-200' : 'border-white/10 bg-slate-900/80 text-slate-200 hover:border-slate-500'
      }`}
    >
      <span>{active ? '♥' : '♡'}</span>
      <span>{count}</span>
    </button>
  )
}
'@
  'src/components/project/SearchBar.jsx' = @'
export default function SearchBar({ searchTerm, onSearch, technologies, selectedTech, onSelectTech, onClearFilter }) {
  return (
    <div className="surface-card rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <label htmlFor="project-search" className="block text-sm font-medium text-slate-300">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by title, description or technology"
            className="input-field mt-2 w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => onSelectTech(tech)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedTech === tech
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tech}
            </button>
          ))}
          <button type="button" onClick={onClearFilter} className="secondary-button">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
'@
  'src/components/comments/CommentCard.jsx' = @'
export default function CommentCard({ comment, currentUser, onEdit, onDelete }) {
  const ownerId = currentUser?._id || currentUser?.id
  const authorId = comment.createdBy || comment.userId || comment.user?._id || comment.user?.id
  const canManage = ownerId && authorId && ownerId === authorId
  const authorName = comment.user?.name || comment.author || comment.name || 'Anonymous'

  return (
    <div className="surface-card rounded-3xl border-slate-800 bg-slate-950/90 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-100">{authorName}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
        {canManage ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(comment)} className="secondary-button">
              Edit
            </button>
            <button type="button" onClick={() => onDelete(comment)} className="secondary-button">
              Delete
            </button>
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{comment.content || comment.text || 'No content yet.'}</p>
    </div>
  )
}
'@
  'src/components/comments/CommentForm.jsx' = @'
import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'

export default function CommentForm({ initialValue = '', onSubmit, submitting, placeholder }) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!value.trim()) return
    onSubmit(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-soft">
      <label className="block text-sm font-medium text-slate-100">Your comment</label>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
        placeholder={placeholder}
        className="input-field mt-3 w-full resize-none"
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Share a helpful remark or feedback for the creator.</p>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post comment'}
        </Button>
      </div>
    </form>
  )
}
'@
  'src/components/comments/CommentList.jsx' = @'
import EmptyState from '../common/EmptyState.jsx'
import CommentCard from './CommentCard.jsx'

export default function CommentList({ comments, currentUser, onEdit, onDelete }) {
  if (!comments || comments.length === 0) {
    return <EmptyState title="No comments yet" description="Be the first to leave feedback on this project." />
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment._id || comment.id} comment={comment} currentUser={currentUser} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
'@
  'src/pages/Home.jsx' = @'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../api/projectApi.js'
import SearchBar from '../components/project/SearchBar.jsx'
import ProjectGrid from '../components/project/ProjectGrid.jsx'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('All')
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      try {
        const data = await getProjects()
        setProjects(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('Unable to load projects. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const technologyOptions = useMemo(() => {
    const tags = new Set(['All'])
    projects.forEach((project) => {
      const techs = Array.isArray(project.technologies) ? project.technologies : []
      techs.forEach((tech) => tags.add(tech))
    })
    return Array.from(tags)
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = [project.title, project.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const hasTech = selectedTech === 'All' || (Array.isArray(project.technologies) && project.technologies.includes(selectedTech))

      return matchesSearch && hasTech
    })
  }, [projects, searchTerm, selectedTech])

  return (
    <div className="space-y-10">
      <section className="glass-card overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/80 p-10 shadow-soft">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-sky-500/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-sky-300">
              Student showcase
            </div>
            <div className="space-y-6">
              <h1 className="section-heading leading-tight text-white">
                Discover inspiring student projects and share your own journey.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Projexa empowers learners to publish portfolios, collaborate through comments, and showcase real world work with polished interactions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/projects/create" className="primary-button">
                Share a project
              </Link>
              <Link to="/dashboard" className="secondary-button">
                My dashboard
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-800 via-slate-950 to-slate-900 p-8 shadow-soft">
            <div className="absolute inset-0 bg-hero opacity-40" />
            <div className="relative z-10 space-y-4 text-slate-200">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Featured experience</p>
              <h2 className="text-3xl font-semibold text-white">Create professional project stories with a modern UI.</h2>
              <p className="max-w-md text-slate-300">
                Build confidence, connect with recruiters, and keep your project portfolio polished with a friendly collaboration platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Browse</p>
            <h2 className="text-3xl font-semibold text-white">Latest student projects</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Filter by language, framework, and project type. Every project is ready to view, comment, and like.
          </p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          technologies={technologyOptions}
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
          onClearFilter={() => {
            setSearchTerm('')
            setSelectedTech('All')
          }}
        />
      </section>

      {error ? (
        <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/10 p-6 text-slate-100">
          <p>{error}</p>
        </div>
      ) : null}

      <ProjectGrid projects={filteredProjects} loading={loading} />
    </div>
  )
}
'@
  'src/pages/Login.jsx' = @'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="glass-card space-y-4 rounded-[40px] border border-white/10 bg-slate-950/80 px-8 py-10 shadow-soft">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Welcome back</p>
          <h1 className="section-heading">Login to your Projexa account</h1>
          <p className="text-slate-400">Use your email and password to access your student project dashboard.</p>
        </div>

        {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} />
          <Input id="password" name="password" label="Password" type="password" value={form.password} onChange={handleChange} />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Signing in...' : 'Login'}
            </Button>
            <Link to="/register" className="text-sm text-slate-300 transition hover:text-white">
              Create a new account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
'@
  'src/pages/Register.jsx' = @'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="glass-card space-y-4 rounded-[40px] border border-white/10 bg-slate-950/80 px-8 py-10 shadow-soft">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">New account</p>
          <h1 className="section-heading">Create your Projexa account</h1>
          <p className="text-slate-400">Sign up with a few details and start sharing your student projects instantly.</p>
        </div>

        {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input id="name" name="name" label="Full name" value={form.name} onChange={handleChange} />
          <Input id="email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} />
          <Input id="password" name="password" label="Password" type="password" value={form.password} onChange={handleChange} />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Creating account...' : 'Register'}
            </Button>
            <Link to="/login" className="text-sm text-slate-300 transition hover:text-white">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
'@
  'src/pages/Dashboard.jsx' = @'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProjects } from '../api/projectApi.js'
import useAuth from '../hooks/useAuth.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true)
      try {
        const data = await getMyProjects()
        setProjects(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('Unable to load your projects.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyProjects()
  }, [])

  const metrics = useMemo(() => {
    const likes = projects.reduce((sum, project) => sum + (project.likes?.length ?? project.likeCount ?? 0), 0)
    const comments = projects.reduce((sum, project) => sum + (project.comments?.length ?? project.commentCount ?? 0), 0)
    return {
      count: projects.length,
      likes,
      comments,
    }
  }, [projects])

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-10 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Dashboard</p>
            <h1 className="section-heading">Welcome back, {user?.name?.split(' ')[0] || 'creator'}.</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Manage your projects, track engagement, and continue building your portfolio with ease.
            </p>
          </div>
          <Link to="/projects/create" className="primary-button">
            Create project
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total projects</p>
          <p className="mt-4 text-4xl font-semibold text-white">{loading ? '...' : metrics.count}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total likes</p>
          <p className="mt-4 text-4xl font-semibold text-white">{loading ? '...' : metrics.likes}</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total comments</p>
          <p className="mt-4 text-4xl font-semibold text-white">{loading ? '...' : metrics.comments}</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">My latest projects</h2>
            <p className="text-sm text-slate-400">Review your active showcase items and open quick actions.</p>
          </div>
          <button type="button" className="secondary-button w-full sm:w-auto">
            View all projects
          </button>
        </div>
        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="surface-card h-40 animate-pulse rounded-[32px]" />
            ))
          ) : projects.length ? (
            projects.map((project) => (
              <div key={project._id || project.id} className="glass-card flex flex-col gap-4 rounded-[32px] border border-white/10 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                    {project.technologies?.slice(0, 3).map((tech) => (
                      <span key={tech} className="tag-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/projects/${project._id || project.id}`} className="secondary-button">
                    View
                  </Link>
                  <Link to={`/projects/${project._id || project.id}/edit`} className="secondary-button">
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card rounded-[32px] border border-white/10 bg-slate-950/80 p-8 text-center text-slate-300">
              You do not have any projects yet. Create your first one to add it to the showcase.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
'@
  'src/pages/MyProjects.jsx' = @'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProject, getMyProjects } from '../api/projectApi.js'
import EmptyState from '../components/common/EmptyState.jsx'

export default function MyProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getMyProjects()
        setProjects(Array.isArray(data) ? data : [])
      } catch (err) {
        setError('Unable to load your projects.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await deleteProject(projectId)
      setProjects((prev) => prev.filter((project) => project._id !== projectId && project.id !== projectId))
    } catch (err) {
      setError('Unable to delete the project.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="surface-card h-32 animate-pulse rounded-[32px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Your workspace</p>
          <h1 className="section-heading">Manage your own projects</h1>
          <p className="text-slate-400">Edit, delete or review the student showcases you created in Projexa.</p>
        </div>
        <Link to="/projects/create" className="primary-button">
          Create new project
        </Link>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}

      {projects.length === 0 ? (
        <EmptyState
          title="No projects in your portfolio"
          description="Create your first showcase project and make it visible to the community."
          actionLabel="Create project"
          actionUrl="/projects/create"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {projects.map((project) => (
            <div key={project._id || project.id} className="glass-card rounded-[32px] border border-white/10 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="tag-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={`/projects/${project._id || project.id}`} className="secondary-button">
                  View
                </Link>
                <Link to={`/projects/${project._id || project.id}/edit`} className="secondary-button">
                  Edit
                </Link>
                <button type="button" onClick={() => handleDelete(project._id || project.id)} className="secondary-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
'@
  'src/pages/CreateProject.jsx' = @'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../api/projectApi.js'
import ProjectForm from '../components/project/ProjectForm.jsx'

export default function CreateProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (payload) => {
    setError('')
    setLoading(true)
    try {
      const created = await createProject(payload)
      navigate(`/projects/${created._id || created.id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">New project</p>
          <h1 className="section-heading">Create a new project showcase</h1>
          <p className="text-slate-400">Publish your project with a description, links, and technology tags.</p>
        </div>
      </section>
      {error ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}
      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
'@
  'src/pages/EditProject.jsx' = @'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject, updateProject } from '../api/projectApi.js'
import ProjectForm from '../components/project/ProjectForm.jsx'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true)
      try {
        const data = await getProject(id)
        setProject(data)
      } catch (err) {
        setError('Unable to load project data.')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleSubmit = async (payload) => {
    setError('')
    setSaving(true)
    try {
      await updateProject(id, payload)
      navigate(`/projects/${id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to update project.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="surface-card h-72 animate-pulse rounded-[40px]" />
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Edit project</p>
          <h1 className="section-heading">Update your showcase details</h1>
          <p className="text-slate-400">Make adjustments and keep your portfolio content polished.</p>
        </div>
      </section>
      {error ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}
      <ProjectForm initialValue={project} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
'@
  'src/pages/ProjectPage.jsx' = @'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject } from '../api/projectApi.js'
import { getComments, createComment, updateComment, deleteComment } from '../api/commentApi.js'
import { toggleLike } from '../api/likeApi.js'
import ProjectDetails from '../components/project/ProjectDetails.jsx'
import CommentForm from '../components/comments/CommentForm.jsx'
import CommentList from '../components/comments/CommentList.jsx'
import useAuth from '../hooks/useAuth.js'

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true)
      try {
        const projectData = await getProject(id)
        setProject(projectData)
        if (projectData.likes && user) {
          setLiked(Boolean(projectData.likes.some((like) => like?.userId === user._id || like?.user === user._id || like?.user?._id === user._id)))
        }
        const commentData = await getComments(id)
        setComments(Array.isArray(commentData) ? commentData : [])
      } catch (err) {
        setError('Unable to load the project details.')
      } finally {
        setLoading(false)
      }
    }
    loadDetails()
  }, [id, user])

  const handleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      const data = await toggleLike(id)
      setLiked((prev) => !prev)
      if (data) {
        setProject((prev) => ({ ...prev, likes: data.likes ?? prev.likes }))
      }
    } catch (err) {
      setError('Unable to update like status.')
    }
  }

  const handleCommentSubmit = async (content) => {
    if (!user) {
      navigate('/login')
      return
    }
    setSubmitting(true)
    try {
      if (editingComment) {
        await updateComment(editingComment._id || editingComment.id, { content })
        setComments((current) => current.map((item) => (item._id === editingComment._id || item.id === editingComment.id ? { ...item, content } : item)))
        setEditingComment(null)
      } else {
        const created = await createComment(id, { content })
        setComments((current) => [created, ...current])
      }
    } catch (err) {
      setError('Unable to submit your comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment)
  }

  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(comment._id || comment.id)
      setComments((current) => current.filter((item) => item._id !== comment._id && item.id !== comment.id))
    } catch (err) {
      setError('Unable to delete the comment.')
    }
  }

  if (loading) {
    return <div className="space-y-6"><div className="surface-card h-96 animate-pulse rounded-[40px]" /></div>
  }

  return (
    <div className="space-y-10">
      {error ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div> : null}
      {project ? (
        <>
          <ProjectDetails project={project} onLike={handleLike} liked={liked} commentsCount={comments.length} />

          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <div className="glass-card rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Comments</h2>
                    <p className="text-sm text-slate-400">Leave feedback or respond to the student.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <CommentForm
                    initialValue={editingComment?.content || ''}
                    onSubmit={handleCommentSubmit}
                    submitting={submitting}
                    placeholder={editingComment ? 'Edit your comment...' : 'Write a comment...'}
                  />
                </div>
              </div>
              <CommentList comments={comments} currentUser={user} onEdit={handleEditComment} onDelete={handleDeleteComment} />
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card rounded-[32px] border border-white/10 bg-slate-950/80 p-8 text-slate-300">Project not found.</div>
      )}
    </div>
  )
}
'@
  'src/pages/Profile.jsx' = @'
import useAuth from '../hooks/useAuth.js'

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-10 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Profile</p>
            <h1 className="section-heading">Your account details</h1>
            <p className="text-slate-400">View your profile information and sign out when you are done.</p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 text-slate-300">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Logged in as</p>
            <p className="mt-4 text-2xl font-semibold text-white">{user?.name || 'Creator'}</p>
            <p className="mt-2 text-sm text-slate-400">{user?.email || 'No email available'}</p>
            <button type="button" onClick={logout} className="mt-6 primary-button w-full">
              Sign out
            </button>
          </div>
        </div>
      </section>

      <div className="glass-card rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-soft">
        <h2 className="text-xl font-semibold text-white">Profile summary</h2>
        <p className="mt-3 text-slate-400">This account can create projects, share comments, and like student work across the platform.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="surface-card p-5">
            <p className="text-sm text-slate-400">Projects</p>
            <p className="mt-3 text-2xl font-semibold text-white">Your showcase items</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm text-slate-400">Comments</p>
            <p className="mt-3 text-2xl font-semibold text-white">Comment on projects</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-sm text-slate-400">Likes</p>
            <p className="mt-3 text-2xl font-semibold text-white">React in one click</p>
          </div>
        </div>
      </div>
    </div>
  )
}
'@
  'src/pages/NotFound.jsx' = @'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-12 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.35em] text-sky-300">404 error</p>
      <h1 className="section-heading">Page not found</h1>
      <p className="mt-4 max-w-xl mx-auto text-slate-400">The page you are trying to reach does not exist. Return home or explore available projects instead.</p>
      <Link to="/" className="primary-button mt-8 inline-flex">
        Back to home
      </Link>
    </div>
  )
}
'@
  'src/pages/Unauthorized.jsx' = @'
import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="glass-card rounded-[40px] border border-white/10 bg-slate-950/80 p-12 text-center shadow-soft">
      <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Unauthorized</p>
      <h1 className="section-heading">Access blocked</h1>
      <p className="mt-4 max-w-xl mx-auto text-slate-400">You need to sign in with the correct account to access this page.</p>
      <Link to="/login" className="primary-button mt-8 inline-flex">
        Login now
      </Link>
    </div>
  )
}
'@
}

foreach ($relative in $files.Keys) {
  $path = Join-Path $PWD $relative
  $dir = Split-Path $path
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -Path $path -Value $files[$relative] -Encoding utf8
}

Write-Host 'Frontend files generated successfully.'
