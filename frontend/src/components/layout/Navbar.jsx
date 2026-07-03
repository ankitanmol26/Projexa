import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth.js'
import Logo from '../common/Logo.jsx'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Projects', to: '/my-projects' },
  { label: 'Create', to: '/projects/create' },
]

export default function Navbar() {
  const { user, logout } = useAuth()

  // initialise from localStorage; default to dark
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('projexa_theme')
    return stored ? stored === 'dark' : true
  })

  // apply / remove the "dark" class on <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('projexa_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--navbar-bg)' }}>
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo className="h-9 w-9" />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-3">

          {/* Dark / Light toggle */}
          <button
            type="button"
            aria-label="Toggle colour scheme"
            onClick={() => setDarkMode((prev) => !prev)}
            className="secondary-button flex items-center gap-2"
          >
            {darkMode ? (
              <>
                {/* Sun icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                Light
              </>
            ) : (
              <>
                {/* Moon icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
                Dark
              </>
            )}
          </button>

          {/* Auth actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleLogout} className="secondary-button">
                Logout
              </button>
              <Link
                to="/profile"
                className="rounded-full px-4 py-2 text-sm transition"
                style={{ border: '1px solid var(--input-border)', color: 'var(--text-secondary)' }}
              >
                {user?.name?.split(' ')[0] || 'Me'}
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="secondary-button">Login</Link>
              <Link to="/register" className="primary-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
