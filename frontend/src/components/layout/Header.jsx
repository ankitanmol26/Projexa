import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../../hooks/useAuth.js'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [search, setSearch]       = useState('')
  const [focused, setFocused]     = useState(false)
  const [profileOpen, setProfileOpen]   = useState(false)
  const [isDark, setIsDark]       = useState(() => document.documentElement.classList.contains('dark'))
  const [scrolled, setScrolled]   = useState(false)
  const [hasNotif, setHasNotif]   = useState(true)  // shows badge until user visits /notifications
  const profileRef = useRef(null)
  const searchRef  = useRef(null)

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Scroll detection for backdrop glow
  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (!mainEl) return
    const h = () => setScrolled(mainEl.scrollTop > 10)
    mainEl.addEventListener('scroll', h, { passive: true })
    return () => mainEl.removeEventListener('scroll', h)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('projexa_theme', next ? 'dark' : 'light')
    setIsDark(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = search.trim()
    if (q) { navigate(`/?search=${encodeURIComponent(q)}`); setSearch('') }
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

  const DROPDOWN_ITEMS = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
    },
    {
      to: '/my-projects',
      label: 'My Projects',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>,
    },
    {
      to: '/bookmarks',
      label: 'Bookmarks',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
    },
  ]

  return (
    <motion.header
      className="shrink-0 flex items-center gap-3 px-4 sm:px-5"
      style={{
        height: 'var(--header-h)',
        background: isDark
          ? 'rgba(9,9,11,0.88)'
          : 'rgba(250,250,250,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        transition: 'box-shadow 0.25s ease',
      }}
      animate={{
        boxShadow: scrolled
          ? isDark
            ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)'
            : '0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)'
          : 'none',
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Mobile hamburger */}
      <motion.button
        type="button"
        onClick={onMenuClick}
        className="btn-icon lg:hidden shrink-0"
        aria-label="Open menu"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </motion.button>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex-1">
        <motion.div
          className="relative"
          animate={{ scale: focused ? 1.006 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <motion.svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              animate={{ color: focused ? 'var(--accent)' : 'var(--text-3)' }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </motion.svg>
          </div>
          <motion.input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search projects, technologies, developers…"
            className="input w-full pl-9 pr-4"
            style={{
              height: 38,
              fontSize: 13.5,
            }}
            animate={{
              background: focused ? 'var(--bg-elevated)' : 'var(--bg-input)',
              boxShadow: focused ? '0 0 0 3px var(--accent-dim)' : 'none',
              borderColor: focused ? 'var(--border-focus)' : 'var(--border)',
            }}
            transition={{ duration: 0.18 }}
            aria-label="Search"
          />
          {focused && search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 inset-y-0 flex items-center"
              style={{ color: 'var(--text-3)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Theme toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={isDark ? 'Light mode' : 'Dark mode'}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 20, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Notifications bell with animated badge */}
        {user && (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              to="/notifications"
              className="btn-icon"
              aria-label="Notifications"
              onClick={() => setHasNotif(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </Link>
            <AnimatePresence>
              {hasNotif && (
                <motion.span
                  className="notif-dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Profile */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <motion.button
              type="button"
              onClick={() => setProfileOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
              style={{ color: 'var(--text-2)' }}
              whileHover={{ background: 'var(--hover-bg)', color: 'var(--text-1)' }}
              whileTap={{ scale: 0.97 }}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="overflow-hidden rounded-lg"
                style={{
                  width: 30, height: 30,
                  boxShadow: '0 0 0 2px var(--accent-border)',
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
                  >
                    {initials}
                  </div>
                )}
              </motion.div>
              <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                {user.name?.split(' ')[0]}
              </span>
              <motion.svg
                animate={{ rotate: profileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 hidden sm:block"
                fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ color: 'var(--text-3)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="dropdown"
                  style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 230 }}
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* User info */}
                  <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
                      >
                        {user.avatar
                          ? <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                          : initials
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{user.name}</p>
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  {DROPDOWN_ITEMS.map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span style={{ color: 'var(--text-3)' }}>{icon}</span>
                      {label}
                    </Link>
                  ))}

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    onClick={() => { logout(); setProfileOpen(false) }}
                    className="dropdown-item w-full text-left"
                    style={{ color: '#F87171' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"    className="btn-secondary btn-sm">Sign in</Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="btn-gradient btn-sm">Get started</Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
