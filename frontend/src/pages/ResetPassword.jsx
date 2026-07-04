import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPasswordRequest } from '../api/authApi.js'
import { useToast } from '../context/ToastContext.jsx'
import Logo from '../components/common/Logo.jsx'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setError('') }

  const strengthLevel = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (p.length >= 12) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    return Math.min(s, 4)
  })()
  const strengthColor = ['', '#f87171', '#fbbf24', '#60a5fa', '#4ade80'][strengthLevel]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.password || !form.confirmPassword) { setError('Please fill in both fields.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await resetPasswordRequest(token, { password: form.password })
      setDone(true)
      success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired reset link.'
      setError(msg)
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8 py-12">
      <div className="text-center space-y-3">
        <div className="flex justify-center"><Logo size={32} showText={false} /></div>
        <div>
          <h1 className="heading-md">Set new password</h1>
          <p className="caption mt-1">Choose a strong password you haven't used before.</p>
        </div>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <svg className="w-6 h-6" fill="none" stroke="#4ADE80" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#4ADE80' }}>Password updated!</p>
              <p className="caption mt-1">Redirecting you to sign in…</p>
            </div>
            <Link to="/login" className="btn-primary btn-sm">Go to Sign In →</Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* New password */}
              <div>
                <label htmlFor="rp-pw" className="label">New password</label>
                <div className="relative">
                  <input
                    id="rp-pw" type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={(e) => set('password', e.target.value)}
                    className="input pr-10" placeholder="Min 8 characters"
                    autoComplete="new-password" autoFocus
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPw((p) => !p)}
                    className="absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-3)' }}>
                    {showPw
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    }
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map((n) => (
                      <div key={n} className="h-1 flex-1 rounded-full transition-all duration-200"
                        style={{ background: n <= strengthLevel ? strengthColor : 'var(--bg-4)' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label htmlFor="rp-confirm" className="label">Confirm password</label>
                <input
                  id="rp-confirm" type="password"
                  value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)}
                  className="input" placeholder="Repeat new password"
                  autoComplete="new-password"
                  style={form.confirmPassword && form.confirmPassword !== form.password ? { borderColor: '#f87171' } : {}}
                />
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <p className="mt-1 text-xs" style={{ color: '#f87171' }}>Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full" style={{ height: 38 }}>
                {loading
                  ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Saving…</span>
                  : 'Reset Password →'}
              </button>
            </form>
            <p className="text-center caption">
              <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>← Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
