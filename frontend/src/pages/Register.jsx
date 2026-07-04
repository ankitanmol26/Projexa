import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'
import { useToast } from '../context/ToastContext.jsx'
import Logo from '../components/common/Logo.jsx'

const ROLES = [
  { value: 'student',   label: 'Student',   desc: 'Showcase my projects', emoji: '👨‍💻' },
  { value: 'recruiter', label: 'Recruiter',  desc: 'Find top talent',       emoji: '🎯' },
]

export default function Register() {
  const { register } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'student' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }

  const pwStrength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (p.length >= 12) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return Math.min(s, 4)
  })()
  const strengthColors = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E']

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register(form)
      success('Account created! Welcome to Projexa 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      setErrors({ form: msg })
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-7"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center"><Logo size={32} showText={false} /></div>
          <div>
            <h1 className="heading-md">Create your account</h1>
            <p className="caption mt-1">Join thousands of developers on Projexa.</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl p-6 space-y-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>

          {/* Role picker */}
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const active = form.role === r.value
              return (
                <motion.button
                  key={r.value} type="button" onClick={() => set('role', r.value)}
                  className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-all"
                  style={{
                    background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base">{r.emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: active ? 'var(--accent)' : 'var(--text-1)' }}>{r.label}</span>
                  <span className="caption text-[10px]">{r.desc}</span>
                </motion.button>
              )
            })}
          </div>

          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg px-3.5 py-2.5 text-sm"
              style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
            >
              {errors.form}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <input type="text" autoComplete="name" autoFocus value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="input" placeholder="Your full name"
                style={errors.name ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
              {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input type="email" autoComplete="email" value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="input" placeholder="you@example.com"
                style={errors.email ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
              {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password} onChange={(e) => set('password', e.target.value)}
                  className="input pr-10" placeholder="Min. 8 characters"
                  style={errors.password ? { borderColor: 'rgba(239,68,68,0.6)' } : {}} />
                <button type="button" tabIndex={-1} onClick={() => setShowPw((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-3)' }}>
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--red)' }}>{errors.password}</p>}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map((n) => (
                    <motion.div key={n} className="h-1 flex-1 rounded-full"
                      animate={{ background: n <= pwStrength ? strengthColors[pwStrength] : 'var(--bg-elevated)' }}
                      transition={{ duration: 0.3 }} />
                  ))}
                </div>
              )}
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-gradient w-full" style={{ height: 40 }}
              whileHover={loading ? {} : { scale: 1.01, y: -0.5 }}
              whileTap={loading ? {} : { scale: 0.98 }}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Creating…</span>
                : 'Create Account'}
            </motion.button>
          </form>
        </div>

        <p className="text-center caption">
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>Sign in →</Link>
        </p>
      </motion.div>
    </div>
  )
}
