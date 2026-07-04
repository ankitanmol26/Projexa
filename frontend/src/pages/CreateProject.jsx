import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createProject } from '../api/projectApi.js'
import ProjectForm from '../components/project/ProjectForm.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function CreateProject() {
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (payload) => {
    setError('')
    setLoading(true)
    try {
      const created = await createProject(payload)
      success('Project published! 🚀')
      navigate(`/projects/${created._id || created.id}`, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create project.'
      setError(msg); toastError(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="page-header">
        <h1 className="heading-lg">Create project</h1>
        <p className="caption mt-1">Publish your work to the Projexa showcase.</p>
      </motion.div>

      {error && <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>{error}</div>}

      <div className="rounded-xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
        <ProjectForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
