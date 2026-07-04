import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPasswordRequest } from '../api/authApi.js'
import Logo from '../components/common/Logo.jsx'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }

    setLoading(true)
    try {
      const data = await forgotPasswordRequest({ email })
      setSent(true)
      if (data?.resetToken) setDevToken(data.resetToken)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8 py-12">
      <div className="text-center space-y-3">
        <div className="flex justify-center"><Logo size={32} showText={false} /></div>
        <div>
          <h1 className="heading-md">Forgot password?</h1>
          <p className="caption mt-1">Enter your email and we'll send you a reset link.</p>
        </div>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
        {sent ? (
          <div className="space-y-5">
            {/* Success */}
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="#4ADE80" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#4ADE80' }}>Check your inbox</p>
                <p className="caption mt-1">
                  If <strong style={{ color: 'var(--text-1)' }}>{email}</strong> is registered, a reset link will arrive shortly.
                </p>
              </div>
            </div>

            {/* Dev-only token display */}
            {devToken && (
              <div
                className="rounded-lg p-3 space-y-2"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#60A5FA' }}>
                  🛠 Dev mode — reset token
                </p>
                <p className="font-mono text-xs break-all" style={{ color: 'var(--text-2)' }}>{devToken}</p>
                <Link
                  to={`/reset-password/${devToken}`}
                  className="text-xs font-semibold transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Open reset page →
                </Link>
              </div>
            )}

            <Link to="/login" className="btn-secondary w-full justify-center" style={{ display: 'flex', height: 36 }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="label">Email address</label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  autoFocus
                  autoComplete="email"
                  className="input"
                  placeholder="you@example.com"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full" style={{ height: 38 }}>
                {loading
                  ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Sending…</span>
                  : 'Send Reset Link →'}
              </button>
            </form>

            <p className="text-center caption">
              Remember your password?{' '}
              <Link to="/login" className="font-medium" style={{ color: 'var(--accent)' }}>Sign in →</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
