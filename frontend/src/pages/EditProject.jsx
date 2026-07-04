import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProject, updateProject } from '../api/projectApi.js'
import ProjectForm from '../components/project/ProjectForm.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .catch(() => setError('Failed to load project.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (payload) => {
    setError('')
    setSaving(true)
    try {
      await updateProject(id, payload)
      success('Project updated!')
      navigate(`/projects/${id}`, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update.'
      setError(msg); toastError(msg)
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-10 w-48 skeleton rounded-lg" />
        <div className="h-96 skeleton rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="page-header">
        <h1 className="heading-lg">Edit project</h1>
        <p className="caption mt-1">Update your project details and republish.</p>
      </motion.div>

      {error && (
        <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
          {error}
        </div>
      )}

      <div className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <ProjectForm initialValue={project} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  )
}
