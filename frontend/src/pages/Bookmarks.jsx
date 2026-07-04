import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProject } from '../api/projectApi.js'
import ProjectGrid from '../components/project/ProjectGrid.jsx'

export default function Bookmarks() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    const ids = (() => { try { return JSON.parse(localStorage.getItem('projexa_bookmarks') || '[]') } catch { return [] } })()
    if (!ids.length) { setLoading(false); return }
    Promise.allSettled(ids.map((id) => getProject(id)))
      .then((res) => setProjects(res.filter((r) => r.status === 'fulfilled').map((r) => r.value)))
      .catch(() => setError('Failed to load bookmarks.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="page-header flex items-center justify-between">
        <div>
          <h1 className="heading-lg">Bookmarks</h1>
          <p className="caption mt-1">{loading ? 'Loading…' : `${projects.length} saved project${projects.length !== 1 ? 's' : ''}`}</p>
        </div>
        {projects.length > 0 && (
          <button type="button" className="btn-danger btn-sm"
            onClick={() => { localStorage.removeItem('projexa_bookmarks'); setProjects([]) }}>
            Clear all
          </button>
        )}
      </motion.div>

      {error && <div className="rounded-lg px-3 py-2.5 text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>{error}</div>}

      <ProjectGrid projects={projects} loading={loading} />
    </div>
  )
}
