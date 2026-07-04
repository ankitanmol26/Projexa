import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { getMyProjects } from '../api/projectApi.js'
import useAuth from '../hooks/useAuth.js'

function pseudoViews(id) {
  if (!id) return 0
  const hex = id.length >= 24 ? id.slice(18) : id.slice(-6)
  return (parseInt(hex, 16) % 2450) + 320
}

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
})

/* Animated count-up */
function Counter({ value, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let frame = 0
    const total = 40
    const timer = setInterval(() => {
      frame++
      setDisplay(Math.round((frame / total) * value))
      if (frame >= total) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [isInView, value])
  return <span ref={ref}>{prefix}{isInView ? display.toLocaleString() : 0}{suffix}</span>
}

/* Mini bar chart — pure CSS/SVG, no library */
function MiniBarChart({ data, color = 'var(--accent)' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max((v / max) * 100, 4)}%` }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
          className="flex-1 rounded-sm"
          style={{ background: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.4 }}
        />
      ))}
    </div>
  )
}

/* Stat card with mini chart */
function StatCard({ label, value, loading, accent, icon, trend, chartData }) {
  return (
    <motion.div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      whileHover={{ y: -4, borderColor: 'var(--border-strong)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend >= 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
              color: trend >= 0 ? '#4ADE80' : '#F87171',
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
          {loading ? <span className="h-7 w-16 skeleton rounded inline-block" /> : <Counter value={Number(value) || 0} />}
        </p>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--text-3)' }}>{label}</p>
      </div>
      {chartData && !loading && <MiniBarChart data={chartData} color={accent} />}
    </motion.div>
  )
}

/* Activity timeline item */
function ActivityItem({ emoji, text, time, isLast }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          {emoji}
        </div>
        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-[13px]" style={{ color: 'var(--text-2)' }}>{text}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{time}</p>
      </div>
    </div>
  )
}

function relativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    getMyProjects()
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => projects.reduce((acc, p) => ({
    likes:    acc.likes    + (p.likes || 0),
    comments: acc.comments + (p.commentsCount || 0),
    views:    acc.views    + pseudoViews(p._id || p.id),
    bookmarks: acc.bookmarks + 0,
  }), { likes: 0, comments: 0, views: 0, bookmarks: 0 }), [projects])

  /* Fake sparkline data seeded from project stats */
  const sparkLikes    = [2, 5, 3, 8, 6, stats.likes || 0]
  const sparkViews    = [120, 340, 280, 520, 410, stats.views || 0]
  const sparkComments = [1, 3, 2, 5, 4, stats.comments || 0]
  const sparkProjects = [0, 1, 1, 1, projects.length - 1, projects.length]

  /* Activity feed from projects */
  const activity = useMemo(() => projects.slice(0, 5).map((p) => ({
    emoji: '🚀',
    text: `You published "${p.title}"`,
    time: p.createdAt ? relativeTime(p.createdAt) : 'recently',
  })), [projects])

  /* Top projects by likes */
  const topProjects = useMemo(() =>
    [...projects].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3),
    [projects]
  )

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👋</span>
            <h1 className="heading-lg" style={{ fontSize: 26 }}>Good to see you, {firstName}!</h1>
          </div>
          <p className="caption">Here's an overview of your portfolio performance.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/projects/create" className="btn-gradient btn-sm self-start">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Project
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Analytics Cards ── */}
      <motion.div {...fadeUp(1)} className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={projects.length} loading={loading} accent="var(--accent)"
          trend={projects.length > 0 ? 12 : undefined}
          chartData={sparkProjects}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>}
        />
        <StatCard label="Total Likes" value={stats.likes} loading={loading} accent="#F87171"
          trend={stats.likes > 0 ? 8 : undefined}
          chartData={sparkLikes}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>}
        />
        <StatCard label="Total Comments" value={stats.comments} loading={loading} accent="#A78BFA"
          trend={stats.comments > 0 ? 23 : undefined}
          chartData={sparkComments}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227L12 21l2.62-3.132c1.584-.233 2.707-1.626 2.707-3.228V6.741" /></svg>}
        />
        <StatCard label="Total Views" value={stats.views} loading={loading} accent="var(--green)"
          trend={stats.views > 0 ? 31 : undefined}
          chartData={sparkViews}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>}
        />
      </motion.div>

      {/* ── Main grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Projects table — spans 2 cols */}
        <motion.div {...fadeUp(2)} className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="heading-sm">Recent Projects</h2>
            <Link to="/my-projects" className="btn-ghost btn-sm text-xs">View all →</Link>
          </div>

          {error && (
            <div className="mx-5 mt-4 rounded-lg px-3 py-2.5 text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 skeleton rounded-xl" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="px-5 py-16 text-center space-y-3">
              <div className="text-4xl">🚀</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>No projects yet</p>
              <p className="caption">Create your first project to start building your portfolio.</p>
              <Link to="/projects/create" className="btn-gradient btn-sm inline-flex mt-2">Create first project</Link>
            </div>
          ) : (
            <div>
              {projects.slice(0, 6).map((p, idx) => {
                const pid = p._id || p.id
                const views = pseudoViews(pid)
                return (
                  <motion.div
                    key={pid}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{ borderBottom: idx < Math.min(projects.length, 6) - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Icon */}
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
                    >
                      {(p.title || 'P')[0].toUpperCase()}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-1)' }}>{p.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                          {p.likes || 0}
                        </span>
                        <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                          {views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {/* Tech badges */}
                    <div className="hidden md:flex gap-1 shrink-0">
                      {(p.technologies || []).slice(0, 2).map((t) => (
                        <span key={t} className="tech-pill text-[10px]">{t}</span>
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link to={`/projects/${pid}`} className="btn-secondary btn-sm" style={{ height: 28, padding: '0 10px', fontSize: 11 }}>View</Link>
                      <Link to={`/projects/${pid}/edit`} className="btn-ghost btn-sm" style={{ height: 28, padding: '0 10px', fontSize: 11 }}>Edit</Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Right column: Activity + Top Projects */}
        <div className="space-y-6">

          {/* Activity Timeline */}
          <motion.div {...fadeUp(3)} className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="heading-sm">Recent Activity</h2>
            {activity.length > 0 ? (
              <div>
                {activity.map((a, i) => (
                  <ActivityItem key={i} {...a} isLast={i === activity.length - 1} />
                ))}
              </div>
            ) : (
              <p className="caption text-center py-6">No activity yet. Start by creating a project.</p>
            )}
          </motion.div>

          {/* Top Performing */}
          {topProjects.length > 0 && (
            <motion.div {...fadeUp(4)} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="heading-sm">Top Performing</h2>
              {topProjects.map((p, i) => {
                const pid = p._id || p.id
                const pct = topProjects[0]?.likes > 0
                  ? Math.round(((p.likes || 0) / (topProjects[0].likes || 1)) * 100)
                  : 0
                const colors = ['var(--accent)', 'var(--violet)', '#22C55E']
                return (
                  <div key={pid} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Link to={`/projects/${pid}`} className="font-medium truncate max-w-[160px] transition-colors hover:text-accent" style={{ color: 'var(--text-2)' }}>
                        {p.title}
                      </Link>
                      <span style={{ color: 'var(--text-3)' }}>{p.likes || 0} ♥</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: colors[i] }}
                      />
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div {...fadeUp(5)} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="heading-sm">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/projects/create', label: 'New project', emoji: '✚', color: 'var(--accent)' },
                { to: '/my-projects',     label: 'My projects', emoji: '📂', color: 'var(--violet)' },
                { to: '/profile',         label: 'Edit profile', emoji: '👤', color: '#22C55E' },
                { to: '/bookmarks',       label: 'Bookmarks',   emoji: '🔖', color: '#F59E0B' },
              ].map(({ to, label, emoji, color }) => (
                <motion.div key={to} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    <span style={{ fontSize: 14 }}>{emoji}</span>{label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Profile Nudge ── */}
      {user && (!user.bio || !user.skills?.length) && (
        <motion.div
          {...fadeUp(6)}
          className="relative overflow-hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl px-6 py-5"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.08))',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <div className="hero-orb-blue" style={{ width: 200, height: 200, top: -60, right: -40, opacity: 0.5 }} />
          <div className="relative z-10">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>🎯 Complete your profile</p>
            <p className="caption mt-0.5">A complete profile gets 4× more recruiter visibility.</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10 shrink-0">
            <Link to="/profile" className="btn-gradient btn-sm self-start">Update Profile →</Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
