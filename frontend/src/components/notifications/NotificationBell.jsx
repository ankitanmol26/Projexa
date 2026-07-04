import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from '../../api/notificationApi.js'
import useAuth from '../../hooks/useAuth.js'

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  // Poll unread count
  useEffect(() => {
    if (!user) return
    const load = () => fetchUnreadCount().then(setUnread).catch(() => {})
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [user])

  // Close on outside click
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const openPanel = async () => {
    const next = !open
    setOpen(next)
    if (next) {
      setLoading(true)
      try {
        const data = await fetchNotifications()
        setNotifs(data || [])
        setUnread(0)
      } finally {
        setLoading(false)
      }
    }
  }

  const markAll = async () => {
    await markAllNotificationsRead()
    setNotifs((p) => p.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }

  const markOne = async (id) => {
    await markNotificationRead(id).catch(() => {})
    setNotifs((p) => p.map((n) => n._id === id ? { ...n, read: true } : n))
  }

  const remove = async (id) => {
    await deleteNotification(id).catch(() => {})
    setNotifs((p) => p.filter((n) => n._id !== id))
  }

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      {/* Bell */}
      <button
        type="button"
        onClick={openPanel}
        className="btn-icon relative"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: '#EF4444', fontSize: 9 }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="dropdown"
          style={{ right: 0, top: 'calc(100% + 8px)', width: 320 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Notifications</p>
            <div className="flex items-center gap-3">
              {notifs.some((n) => !n.read) && (
                <button type="button" onClick={markAll} className="caption transition-colors" style={{ color: 'var(--accent)' }}>
                  Mark all read
                </button>
              )}
              <Link to="/notifications" onClick={() => setOpen(false)} className="caption" style={{ color: 'var(--text-3)' }}>
                See all →
              </Link>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {loading ? (
              <div className="py-8 text-center caption">Loading…</div>
            ) : notifs.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xl mb-1">🔔</p>
                <p className="caption">No notifications yet</p>
              </div>
            ) : (
              notifs.slice(0, 8).map((n, idx) => (
                <div
                  key={n._id}
                  className="group flex items-start gap-3 px-4 py-3 transition-colors"
                  style={{
                    borderBottom: idx < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                    background: n.read ? 'transparent' : 'rgba(59,130,246,0.03)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-overlay)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(59,130,246,0.03)'}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: n.read ? 'transparent' : 'var(--accent)' }} />

                  <Link
                    to={`/projects/${n.project?._id}`}
                    onClick={() => { markOne(n._id); setOpen(false) }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs leading-snug" style={{ color: 'var(--text-1)' }}>
                      <span className="font-semibold">{n.sender?.name || 'Someone'}</span>
                      <span style={{ color: 'var(--text-2)' }}>
                        {n.type === 'like' ? ' liked ' : ' commented on '}
                      </span>
                      <span className="font-semibold">{n.project?.title}</span>
                    </p>
                    {n.message && (
                      <p className="text-[11px] mt-0.5 truncate italic" style={{ color: 'var(--text-3)' }}>
                        "{n.message}"
                      </p>
                    )}
                    <p className="caption mt-0.5">{timeAgo(n.createdAt)}</p>
                  </Link>

                  <button
                    type="button"
                    onClick={() => remove(n._id)}
                    className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    style={{ height: 20, width: 20 }}
                    aria-label="Dismiss"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
