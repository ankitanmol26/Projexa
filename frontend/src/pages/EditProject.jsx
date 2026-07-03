import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject, updateProject } from '../api/projectApi.js'
import ProjectForm from '../components/project/ProjectForm.jsx'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true)
      try {
        const data = await getProject(id)
        setProject(data)
      } catch {
        setError('Unable to load project data.')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id])

  const handleSubmit = async (payload) => {
    setError('')
    setSaving(true)
    try {
      await updateProject(id, payload)
      navigate(`/projects/${id}`, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to update project.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="surface-card h-72 animate-pulse rounded-[40px]" />
  }

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[40px] p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Edit project</p>
          <h1 className="section-heading">Update your showcase</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Make adjustments and keep your portfolio content polished.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
          {error}
        </div>
      )}

      <ProjectForm initialValue={project} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
