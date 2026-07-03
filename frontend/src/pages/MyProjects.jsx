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
      } catch {
        setError('Unable to load your projects.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    try {
      await deleteProject(projectId)
      setProjects((prev) =>
        prev.filter((p) => p._id !== projectId && p.id !== projectId)
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the project.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card h-32 animate-pulse rounded-[32px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card flex flex-col gap-4 rounded-[40px] p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Your workspace</p>
          <h1 className="section-heading">My projects</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Edit, delete, or review the showcases you created.
          </p>
        </div>
        <Link to="/projects/create" className="primary-button whitespace-nowrap">
          Create new project
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
          {error}
        </div>
      )}

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
            <div key={project._id || project.id} className="glass-card rounded-[32px] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="tag-pill">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/projects/${project._id || project.id}`}
                  className="secondary-button"
                >
                  View
                </Link>
                <Link
                  to={`/projects/${project._id || project.id}/edit`}
                  className="secondary-button"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(project._id || project.id)}
                  className="inline-flex items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-400/20"
                >
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
