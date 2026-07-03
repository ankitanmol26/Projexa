import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to register. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="glass-card space-y-6 rounded-[40px] px-8 py-10">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Get started</p>
          <h1 className="section-heading">Create your account</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Sign up in seconds and start sharing your projects.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <Input
            id="name"
            name="name"
            label="Full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          <Input
            id="email"
            name="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Password must be at least 8 characters.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Creating account…' : 'Register'}
            </Button>
            <Link
              to="/login"
              className="text-sm transition hover:text-sky-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              Already have an account? →
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
