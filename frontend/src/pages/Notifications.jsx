import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from '../api/notificationApi.js'

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const TYPE = {
  like:    { bg: 'rgba(239,68,68,0.12)', color: '#F87171', label: 'liked your project' },
  comment: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA', label: 'commented on' },
}
const FILTERS = [
  { id: 'all', label: 'All' }, { id: 'unread', label: 'Unread' },
  { id: 'like', label: 'Likes' }, { id: 'comment', label: 'Comments' },
]

export default function Notifications() {
  const [notifs, setNotifs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    fetchNotifications()
      .then((d) => setNotifs(d || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markAll = async () => {
    await markAllNotificationsRead()
    setNotifs((p) => p.map((n) => ({ ...n, read: true })))
  }
  const markOne = async (id) => {
    await markNotificationRead(id).catch(() => {})
    setNotifs((p) => p.map((n) => n._id === id ? { ...n, read: true } : n))
  }
  const remove = async (id) => {
    await deleteNotification(id).catch(() => {})
    setNotifs((p) => p.filter((n) => n._id !== id))
  }

  const filtered = notifs.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'like' || filter === 'comment') return n.type === filter
    return true
  })
  const unread = notifs.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-5 page-enter">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="page-header flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Notifications</h1>
          <p className="caption mt-1">{loading ? 'Loading…' : `${notifs.length} total${unread > 0 ? ` · ${unread} unread` : ''}`}</p>
        </div>
        {unread > 0 && <button type="button" onClick={markAll} className="btn-secondary btn-sm">Mark all read</button>}
      </motion.div>

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <motion.button key={f.id} type="button" onClick={() => setFilter(f.id)}
            className="transition-all duration-150"
            style={{
              height: 26, padding: '0 10px', fontSize: 12, borderRadius: 7, fontWeight: 500, cursor: 'pointer',
              background: filter === f.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              border: `1px solid ${filter === f.id ? 'var(--accent-border)' : 'var(--border)'}`,
              color: filter === f.id ? 'var(--accent)' : 'var(--text-2)',
            }}
            whileTap={{ scale: 0.95 }}>
            {f.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl px-5 py-14 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </p>
          <p className="caption mt-1">You'll be notified when someone likes or comments on your projects.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {filtered.map((n, idx) => {
            const s = TYPE[n.type] || TYPE.comment
            return (
              <motion.div key={n._id}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                className="group flex items-start gap-3 px-5 py-4 transition-colors"
                style={{
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  background: n.read ? 'transparent' : 'rgba(59,130,246,0.03)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(59,130,246,0.03)'}>
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: n.read ? 'transparent' : 'var(--accent)' }} />
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                  {n.type === 'like'
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: s.color }}><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: s.color }}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227L12 21l2.62-3.132c1.584-.233 2.707-1.626 2.707-3.228V6.741" /></svg>
                  }
                </div>
                <Link to={`/projects/${n.project?._id}`} onClick={() => !n.read && markOne(n._id)} className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--text-1)' }}>
                    <span className="font-semibold">{n.sender?.name || 'Someone'}</span>
                    {' '}<span style={{ color: 'var(--text-2)' }}>{s.label}</span>{' '}
                    <span className="font-semibold">{n.project?.title}</span>
                  </p>
                  {n.message && <p className="text-xs mt-0.5 italic truncate" style={{ color: 'var(--text-3)' }}>"{n.message}"</p>}
                  <p className="caption mt-1">{timeAgo(n.createdAt)}</p>
                </Link>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!n.read && (
                    <button type="button" onClick={() => markOne(n._id)} className="btn-icon" style={{ height: 22, width: 22 }} title="Mark read">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </button>
                  )}
                  <button type="button" onClick={() => remove(n._id)} className="btn-icon" style={{ height: 22, width: 22, color: '#F87171' }} title="Delete">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
