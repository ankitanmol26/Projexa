import { NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../../hooks/useAuth.js'
import Logo from '../common/Logo.jsx'

const NAV_ITEMS = [
  {
    to: '/', end: true, label: 'Explore',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    to: '/dashboard', end: false, label: 'Dashboard', authOnly: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    to: '/my-projects', end: false, label: 'My Projects', authOnly: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
  },
  {
    to: '/bookmarks', end: false, label: 'Bookmarks', authOnly: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    ),
  },
  {
    to: '/notifications', end: false, label: 'Notifications', authOnly: true,
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
  {
    to: '/settings', end: false, label: 'Settings',
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
]

const stagger = {
  animate: { transition: { staggerChildren: 0.045 } },
}
const navItemAnim = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.22 },
}

function SidebarInner({ onClose, collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('projexa_theme', next ? 'dark' : 'light')
    setIsDark(next)
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const visible  = NAV_ITEMS.filter((n) => !n.authOnly || user)

  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Logo + Collapse Button ── */}
      <div
        className="flex items-center h-[var(--header-h)] px-3 shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Link to="/" onClick={onClose}>
                <Logo size={26} showText />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle — desktop only */}
        {onToggleCollapse && (
          <motion.button
            type="button"
            onClick={onToggleCollapse}
            className="btn-icon"
            style={{ width: 32, height: 32 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.svg
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </motion.svg>
          </motion.button>
        )}
      </div>

      {/* ── New Project CTA ── */}
      {user && !collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 pt-4 pb-2 shrink-0"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/projects/create"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full rounded-xl font-semibold text-white text-sm btn-shimmer"
              style={{
                height: 36,
                background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                boxShadow: '0 2px 16px rgba(124,58,237,0.32)',
                letterSpacing: '-0.01em',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Project
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* Collapsed new project icon */}
      {user && collapsed && (
        <div className="px-2 pt-4 pb-2 flex justify-center shrink-0">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/projects/create"
              onClick={onClose}
              title="New Project"
              className="flex items-center justify-center rounded-xl text-white"
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                boxShadow: '0 2px 12px rgba(124,58,237,0.28)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Link>
          </motion.div>
        </div>
      )}

      {/* ── Nav ── */}
      <motion.nav
        className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-0.5"
        style={{ padding: collapsed ? '12px 8px' : '12px 10px' }}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {visible.map((item) => (
          <motion.div key={item.to} variants={navItemAnim}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onClose}
            >
              {({ isActive }) => (
                <motion.div
                  className="relative flex items-center rounded-xl cursor-pointer select-none transition-all duration-150"
                  style={{
                    height: 40,
                    padding: collapsed ? '0 10px' : '0 12px',
                    gap: collapsed ? 0 : 10,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: isActive ? 'var(--accent)' : 'var(--text-2)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    borderRadius: isActive ? '0 10px 10px 0' : '10px',
                    marginLeft: isActive ? '-10px' : '0',
                    paddingLeft: isActive ? (collapsed ? '13px' : '19px') : (collapsed ? '10px' : '12px'),
                  }}
                  whileHover={{
                    background: isActive ? 'var(--accent-dim)' : 'var(--hover-bg)',
                    color: isActive ? 'var(--accent)' : 'var(--text-1)',
                    x: isActive ? 0 : 2,
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      {/* ── Bottom section ── */}
      <div
        className="shrink-0 space-y-1"
        style={{
          borderTop: '1px solid var(--border)',
          padding: collapsed ? '12px 8px' : '12px 10px',
        }}
      >
        {/* Theme toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center rounded-xl cursor-pointer select-none transition-all duration-150"
          style={{
            height: 40,
            padding: collapsed ? '0 10px' : '0 12px',
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontSize: 13.5,
            fontWeight: 500,
            color: 'var(--text-2)',
            background: 'transparent',
            border: 'none',
          }}
          whileHover={{ background: 'var(--hover-bg)', color: 'var(--text-1)' }}
          whileTap={{ scale: 0.96 }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={collapsed ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
        >
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </motion.span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {isDark ? 'Light mode' : 'Dark mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile block */}
        {user ? (
          collapsed ? (
            /* Collapsed: just avatar */
            <div className="flex flex-col items-center gap-1">
              <Link to="/profile" onClick={onClose} title={user.name}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
                >
                  {user.avatar
                    ? <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                    : initials
                  }
                </motion.div>
              </Link>
              <motion.button
                type="button"
                onClick={() => { logout(); onClose?.() }}
                title="Sign out"
                className="btn-icon"
                style={{ width: 32, height: 32 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" style={{ color: '#F87171' }} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </motion.button>
            </div>
          ) : (
            /* Expanded: premium profile card */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="profile-card-sidebar"
            >
              <div className="flex items-center gap-3 mb-3">
                <Link to="/profile" onClick={onClose} className="shrink-0">
                  <div
                    className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))', ring: '2px solid var(--accent)' }}
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                      : initials
                    }
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{user.name}</p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-3)' }}>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    height: 30,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Profile
                </Link>
                <motion.button
                  type="button"
                  onClick={() => { logout(); onClose?.() }}
                  className="flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    height: 30,
                    width: 36,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#F87171',
                  }}
                  whileHover={{ background: 'rgba(239,68,68,0.15)', scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign out"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )
        ) : (
          !collapsed && (
            <div className="space-y-1.5 pt-1">
              <Link to="/login"    onClick={onClose} className="btn-secondary btn-sm w-full justify-center">Sign in</Link>
              <Link to="/register" onClick={onClose} className="btn-gradient btn-sm w-full justify-center">Get started free</Link>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose, collapsed, onToggleCollapse }) {
  return (
    <>
      {/* Desktop */}
      <motion.aside
        className="hidden lg:flex flex-col shrink-0 overflow-hidden"
        animate={{ width: collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <SidebarInner collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-40 flex flex-col lg:hidden"
            style={{ width: 'var(--sidebar-w)' }}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <SidebarInner onClose={onMobileClose} collapsed={false} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
