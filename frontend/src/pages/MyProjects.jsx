import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { deleteProject, getMyProjects } from '../api/projectApi.js'
import { useToast } from '../context/ToastContext.jsx'

function pseudoViews(id) {
  if (!id) return 0
  const hex = id.length >= 24 ? id.slice(18) : id.slice(-6)
  return (parseInt(hex, 16) % 2450) + 320
}

export default function MyProjects() {
  const { success, error: toastError } = useToast()
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    getMyProjects()
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (pid, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(pid)
    try {
      await deleteProject(pid)
      setProjects((p) => p.filter((x) => (x._id || x.id) !== pid))
      success('Project deleted. 🗑️')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete.'
      setError(msg); toastError(msg)
    } finally { setDeletingId(null) }
  }

  return (
    <div className="space-y-8 page-enter max-w-5xl mx-auto">
      
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, var(--violet), transparent 70%)', transform: 'translate(30%, -30%)' }} />
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <h1 className="heading-lg" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>My Projects</h1>
            <p className="caption mt-1.5" style={{ fontSize: 14 }}>
              {loading ? 'Loading your portfolio…' : `You have ${projects.length} project${projects.length !== 1 ? 's' : ''} published.`}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/projects/create" className="btn-gradient relative overflow-hidden" style={{ height: 44, padding: '0 20px' }}>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="relative z-10 font-semibold">New Project</span>
              <div className="btn-shimmer" />
            </Link>
          </motion.div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl px-8 py-20 text-center relative overflow-hidden shadow-sm" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-strong)' }}>
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at center, var(--accent), transparent 60%)' }} />
          <div className="relative z-10">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-1)' }}>Your portfolio is empty</p>
            <p className="caption mt-1 mb-6 text-base">Create your first project to start showing off your work.</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/projects/create" className="btn-gradient relative overflow-hidden h-11 px-6">
                <span className="relative z-10">Create first project</span>
                <div className="btn-shimmer" />
              </Link>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <AnimatePresence>
            {projects.map((p, idx) => {
              const pid = p._id || p.id
              const isDeleting = deletingId === pid
              const views = pseudoViews(pid)
              
              return (
                <motion.div
                  key={pid}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 transition-colors relative"
                  style={{ borderBottom: idx < projects.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}>
                    {(p.title || 'P')[0].toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold truncate" style={{ color: 'var(--text-1)' }}>{p.title}</p>
                      {p.isFeatured && <span className="badge-amber text-[10px] px-1.5 py-0.5">⭐ Featured</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 caption text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                        {p.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227L12 21l2.62-3.132c1.584-.233 2.707-1.626 2.707-3.228V6.741" /></svg>
                        {p.commentsCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        {views.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="hidden lg:flex gap-1.5 shrink-0">
                    {(p.technologies || []).slice(0, 3).map((t) => (
                      <span key={t} className="tech-pill text-[11px] px-2.5 py-1">{t}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 md:ml-4">
                    <Link to={`/projects/${pid}`} className="btn-secondary" style={{ height: 32, padding: '0 12px', fontSize: 12 }}>View</Link>
                    <Link to={`/projects/${pid}/edit`} className="btn-ghost" style={{ height: 32, padding: '0 12px', fontSize: 12 }}>Edit</Link>
                    <div className="w-px h-6 mx-1" style={{ background: 'var(--border)' }} />
                    <motion.button
                      type="button" onClick={() => handleDelete(pid, p.title)} disabled={isDeleting}
                      className="btn-icon" style={{ height: 32, width: 32, color: '#F87171' }}
                      whileHover={{ background: 'var(--red-dim)' }} whileTap={{ scale: 0.95 }}
                      title="Delete Project"
                    >
                      {isDeleting ? (
                        <span className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(239,68,68,0.3)', borderTopColor: '#F87171' }} />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
