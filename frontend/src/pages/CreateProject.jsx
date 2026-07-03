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
      <section className="glass-card rounded-[40px] p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">New project</p>
          <h1 className="section-heading">Create a project showcase</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Publish your project with a description, links, and technology tags.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
          {error}
        </div>
      )}

      <ProjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
