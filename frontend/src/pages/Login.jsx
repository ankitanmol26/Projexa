import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to login. Please check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <div className="glass-card space-y-6 rounded-[40px] px-8 py-10">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Welcome back</p>
          <h1 className="section-heading">Sign in to Projexa</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Enter your email and password to access your dashboard.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
            autoComplete="current-password"
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Signing in…' : 'Login'}
            </Button>
            <Link
              to="/register"
              className="text-sm transition hover:text-sky-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              Create a new account →
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
