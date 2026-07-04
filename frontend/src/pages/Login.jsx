import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'
import { useToast } from '../context/ToastContext.jsx'
import Logo from '../components/common/Logo.jsx'

export default function Login() {
  const { login } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const user = await login(form)
      success(`Welcome back, ${user?.name?.split(' ')[0] || 'there'}! 👋`)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setErrors({ form: msg })
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto relative page-enter">
      
      {/* Premium ambient glows */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="hero-orb-violet" style={{ width: 400, height: 400, opacity: 0.25, top: -50 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Logo size={42} showText={false} />
          </motion.div>
          <div>
            <h1 className="heading-md" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>Welcome back</h1>
            <p className="caption mt-1.5" style={{ fontSize: 14 }}>Sign in to continue to Projexa.</p>
          </div>
        </div>

        {/* Premium Card */}
        <div
          className="rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-border)', backdropFilter: 'blur(24px)' }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--violet))' }} />

          <AnimatePresence>
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-4"
                  style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {errors.form}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="label text-[13px] font-semibold tracking-wide">Email</label>
              <input
                type="email" autoComplete="email" autoFocus
                value={form.email} onChange={(e) => set('email', e.target.value)}
                className="input h-11" placeholder="you@example.com"
                style={errors.email ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label text-[13px] font-semibold tracking-wide mb-0">Password</label>
                <Link to="/forgot-password" className="caption text-xs hover:underline transition-colors hover:text-accent" style={{ color: 'var(--text-3)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password} onChange={(e) => set('password', e.target.value)}
                  className="input h-11 pr-10" placeholder="••••••••"
                  style={errors.password ? { borderColor: 'rgba(239,68,68,0.6)' } : {}}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-3)' }}>
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              className="btn-gradient w-full mt-2 relative overflow-hidden"
              style={{ height: 44, fontSize: 14.5 }}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  Signing in…
                </span>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <div className="btn-shimmer" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm" style={{ color: 'var(--text-3)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold transition-colors hover:text-accent" style={{ color: 'var(--text-1)' }}>Create one for free</Link>
        </p>
      </motion.div>
    </div>
  )
}
