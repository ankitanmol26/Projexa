import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { validateProjectPayload } from '../../utils/validators.js'

const SUGGESTED = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'FastAPI', 'Django',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'TypeScript', 'JavaScript', 'Python', 'Java',
  'Docker', 'AWS', 'Firebase', 'GraphQL', 'Tailwind CSS', 'Spring Boot', 'Android', 'Flutter',
  'AI/ML', 'Blockchain', 'IoT', 'Kubernetes', 'Go', 'Rust',
]

const toCSV = (arr = []) => Array.isArray(arr) ? arr.join(', ') : ''

export default function ProjectForm({ initialValue = null, onSubmit, loading }) {
  const [values, setValues] = useState({
    title: '', description: '', technologies: '', githubUrl: '', liveDemoUrl: '', image: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValue) {
      setValues({
        title: initialValue.title || '',
        description: initialValue.description || '',
        technologies: toCSV(initialValue.technologies),
        githubUrl: initialValue.githubUrl || '',
        liveDemoUrl: initialValue.liveDemoUrl || '',
        image: initialValue.image || '',
      })
    }
  }, [initialValue])

  const set = (k, v) => {
    setValues((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }

  const currentTechs = values.technologies.split(',').map((t) => t.trim()).filter(Boolean)

  const addTech = (tech) => {
    if (!currentTechs.includes(tech)) set('technologies', [...currentTechs, tech].join(', '))
  }

  const removeTech = (tech) => {
    set('technologies', currentTechs.filter((t) => t !== tech).join(', '))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      githubUrl: values.githubUrl.trim(),
      liveDemoUrl: values.liveDemoUrl.trim(),
      image: values.image.trim(),
      technologies: values.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    }
    const errs = validateProjectPayload(payload)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    onSubmit(payload)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title + GitHub */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Title <span style={{ color: '#F87171' }}>*</span></label>
          <input
            value={values.title} onChange={(e) => set('title', e.target.value)}
            className="input h-11" placeholder="e.g. Developer Portfolio App"
            style={errors.title ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
          />
          {errors.title && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.title}</p>}
        </div>
        <div>
          <label className="label">GitHub Repository <span style={{ color: '#F87171' }}>*</span></label>
          <input
            type="url" value={values.githubUrl} onChange={(e) => set('githubUrl', e.target.value)}
            className="input h-11" placeholder="https://github.com/user/repo"
            style={errors.githubUrl ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
          />
          {errors.githubUrl && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.githubUrl}</p>}
        </div>
      </div>

      {/* Demo + Image */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Live Demo URL (Optional)</label>
          <input
            type="url" value={values.liveDemoUrl} onChange={(e) => set('liveDemoUrl', e.target.value)}
            className="input h-11" placeholder="https://myapp.vercel.app"
          />
          {errors.liveDemoUrl && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.liveDemoUrl}</p>}
        </div>
        <div>
          <label className="label">Cover Image URL (Optional)</label>
          <input
            type="url" value={values.image} onChange={(e) => set('image', e.target.value)}
            className="input h-11" placeholder="https://example.com/screenshot.png"
          />
          {values.image && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 overflow-hidden rounded-xl shadow-sm" style={{ border: '1px solid var(--border)' }}
            >
              <img src={values.image} alt="Preview" onError={(e) => e.target.style.display = 'none'}
                className="w-full object-cover" style={{ maxHeight: 140 }} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">Project Description <span style={{ color: '#F87171' }}>*</span></label>
          <span className="caption text-[11px] font-medium" style={{ color: values.description.length > 2900 ? '#F87171' : 'var(--text-3)' }}>
            {values.description.length}/3000
          </span>
        </div>
        <textarea
          value={values.description} onChange={(e) => set('description', e.target.value)}
          className="textarea w-full" maxLength={3000}
          placeholder="Describe your project — what problem does it solve? What makes the technical implementation interesting?"
          style={{ minHeight: 140, ...(errors.description ? { borderColor: 'rgba(239,68,68,0.6)' } : {}) }}
        />
        {errors.description && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.description}</p>}
      </div>

      {/* Technologies */}
      <div>
        <label className="label">Tech Stack <span style={{ color: '#F87171' }}>*</span></label>
        <input
          value={values.technologies} onChange={(e) => set('technologies', e.target.value)}
          className="input h-11" placeholder="Type technologies separated by commas (e.g. React, Node.js)"
          style={errors.technologies ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
        />
        {errors.technologies && <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{errors.technologies}</p>}

        {/* Selected pills */}
        {currentTechs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            {currentTechs.map((t) => (
              <motion.button
                key={t} type="button"
                onClick={() => removeTech(t)}
                className="badge-blue cursor-pointer flex items-center gap-1.5 px-2.5 py-1"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {t}
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            ))}
          </div>
        )}

        {/* Quick-add */}
        <div className="mt-3">
          <p className="caption mb-2 font-medium">Popular Technologies</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.filter((t) => !currentTechs.includes(t)).slice(0, 16).map((t) => (
              <motion.button
                key={t} type="button" onClick={() => addTech(t)}
                className="badge cursor-pointer px-2 py-1"
                style={{ fontSize: 11, background: 'var(--bg-card)' }}
                whileHover={{ borderColor: 'var(--accent-border)', color: 'var(--accent)', y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                + {t}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div
        className="flex items-center justify-between pt-6 mt-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="caption"><span style={{ color: '#F87171' }}>*</span> Required Fields</p>
        <motion.button
          type="submit"
          disabled={loading}
          className="btn-gradient relative overflow-hidden"
          style={{ height: 44, padding: '0 24px', fontSize: 14 }}
          whileHover={loading ? {} : { scale: 1.02, y: -1 }}
          whileTap={loading ? {} : { scale: 0.98 }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
              Publishing…
            </span>
          ) : (
            <>
              <span className="relative z-10">Publish Project</span>
              <div className="btn-shimmer" />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}
