import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'
import { useToast } from '../context/ToastContext.jsx'

const TABS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'account',    label: 'Account' },
  { id: 'privacy',    label: 'Privacy' },
]

export default function Settings() {
  const { user, logout } = useAuth()
  const { success, warning, info } = useToast()
  const [tab, setTab]         = useState('appearance')
  const [isDark, setIsDark]   = useState(() => document.documentElement.classList.contains('dark'))
  const [deleteInput, setDeleteInput] = useState('')

  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const applyTheme = (dark) => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('projexa_theme', dark ? 'dark' : 'light')
    setIsDark(dark)
    success(`Switched to ${dark ? 'dark' : 'light'} mode`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="page-header">
        <h1 className="heading-lg">Settings</h1>
        <p className="caption mt-1">Manage your account and preferences.</p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-[170px_1fr]">
        {/* Tab nav */}
        <nav className="flex sm:flex-col gap-1">
          {TABS.map((t) => (
            <motion.button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`nav-item text-left ${tab === t.id ? 'nav-item-active' : ''}`}
              whileTap={{ scale: 0.97 }}>
              {t.label}
            </motion.button>
          ))}
        </nav>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          {/* Appearance */}
          {tab === 'appearance' && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <h2 className="heading-sm">Theme</h2>
                <p className="caption mt-0.5">Choose your preferred color scheme.</p>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3" style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)' }}>
                {[{ value: true, label: 'Dark', desc: 'Easy on the eyes', icon: '🌙' },
                  { value: false, label: 'Light', desc: 'Clean and bright', icon: '☀️' }].map((opt) => {
                  const active = isDark === opt.value
                  return (
                    <motion.button key={opt.label} type="button" onClick={() => applyTheme(opt.value)}
                      className="flex items-center gap-3 rounded-lg p-4 text-left transition-all"
                      style={{
                        background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                        border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
                      }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: active ? 'var(--accent)' : 'var(--text-1)' }}>{opt.label}</p>
                        <p className="caption">{opt.desc}</p>
                      </div>
                      {active && (
                        <svg className="w-4 h-4 ml-auto shrink-0" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Account */}
          {tab === 'account' && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <h2 className="heading-sm">Account details</h2>
                </div>
                <div style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)' }}>
                  {[{ l: 'Name', v: user?.name }, { l: 'Email', v: user?.email }, { l: 'Role', v: user?.role }]
                    .map(({ l, v }, i, arr) => (
                      <div key={l} className="flex items-center justify-between px-5 py-3.5"
                        style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <span className="caption">{l}</span>
                        <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-1)' }}>{v || '—'}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="rounded-xl p-5 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                <h2 className="heading-sm">Session</h2>
                <p className="body-sm">You are signed in on this device.</p>
                <button type="button" onClick={logout} className="btn-danger btn-sm">Sign out</button>
              </div>
            </div>
          )}

          {/* Privacy */}
          {tab === 'privacy' && (
            <div className="space-y-4">
              <div className="rounded-xl p-5 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                <h2 className="heading-sm">Local data</h2>
                <p className="body-sm">Projexa stores your auth token and bookmarks in your browser.</p>
                <button type="button" className="btn-secondary btn-sm"
                  onClick={() => { localStorage.removeItem('projexa_bookmarks'); info('Bookmarks cleared.') }}>
                  Clear bookmarks
                </button>
              </div>
              <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.25)', backdropFilter: 'blur(12px)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--red)' }}>Danger zone</h2>
                <p className="body-sm">Permanently delete your account. This cannot be undone.</p>
                <div className="space-y-2">
                  <label className="label">Type <strong style={{ color: 'var(--text-1)' }}>DELETE</strong> to confirm</label>
                  <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)}
                    className="input" placeholder="DELETE" style={{ maxWidth: 220 }} />
                </div>
                <button type="button" disabled={deleteInput !== 'DELETE'}
                  onClick={() => warning('Account deletion is not yet available.')}
                  className="btn-danger btn-sm"
                  style={{ opacity: deleteInput !== 'DELETE' ? 0.4 : 1, cursor: deleteInput !== 'DELETE' ? 'not-allowed' : 'pointer' }}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
