import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import Input from '../common/Input.jsx'
import { validateProjectPayload } from '../../utils/validators.js'

const toCommaSeparated = (technologies = []) =>
  Array.isArray(technologies) ? technologies.join(', ') : ''

export default function ProjectForm({ initialValue = null, onSubmit, loading }) {
  const [values, setValues] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    image: '',          // matches backend Project.image field
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialValue) {
      setValues({
        title: initialValue.title || '',
        description: initialValue.description || '',
        technologies: toCommaSeparated(initialValue.technologies || []),
        githubUrl: initialValue.githubUrl || '',
        liveDemoUrl: initialValue.liveDemoUrl || '',
        image: initialValue.image || '',
      })
    }
  }, [initialValue])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // clear error for that field as user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const techArray = values.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      githubUrl: values.githubUrl.trim(),
      liveDemoUrl: values.liveDemoUrl.trim(),
      image: values.image.trim(),
      technologies: techArray,
    }

    const validation = validateProjectPayload(payload)
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }

    setErrors({})
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8">
      <div>
        <h2 className="section-heading">Project details</h2>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Add a compelling showcase project with repository links, live demo, and technologies.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Input
          id="title"
          name="title"
          label="Project title *"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Student Portfolio App"
        />
        <Input
          id="githubUrl"
          name="githubUrl"
          label="GitHub URL *"
          value={values.githubUrl}
          onChange={handleChange}
          error={errors.githubUrl}
          placeholder="https://github.com/user/repo"
        />
        <Input
          id="liveDemoUrl"
          name="liveDemoUrl"
          label="Live demo URL"
          value={values.liveDemoUrl}
          onChange={handleChange}
          error={errors.liveDemoUrl}
          placeholder="https://myapp.vercel.app"
        />
        <Input
          id="image"
          name="image"
          label="Image URL"
          value={values.image}
          onChange={handleChange}
          placeholder="https://example.com/screenshot.png"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="input-field w-full resize-none"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe what makes this project special, what problems it solves, and the tech stack used..."
        />
        {errors.description && (
          <p className="text-xs text-rose-400">{errors.description}</p>
        )}
      </div>

      <div>
        <Input
          id="technologies"
          name="technologies"
          label="Technologies (comma-separated) *"
          value={values.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB, Tailwind"
          error={errors.technologies}
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          Tip: add 3–5 technologies that best describe this project.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save project'}
        </Button>
      </div>
    </form>
  )
}
