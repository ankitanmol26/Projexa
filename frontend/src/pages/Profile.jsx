import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../hooks/useAuth.js'
import { useToast } from '../context/ToastContext.jsx'

function strength(user) {
  let s = 0
  if (user?.name)         s += 15
  if (user?.bio)          s += 20
  if (user?.location)     s += 10
  if (user?.skills?.length) s += 20
  if (user?.avatar)       s += 15
  if (user?.githubUrl)    s += 10
  if (user?.linkedinUrl)  s += 5
  if (user?.portfolioUrl) s += 5
  return s
}

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
})

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { success, error: toastError } = useToast()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', bio: '', location: '', skills: '', avatar: '',
    githubUrl: '', linkedinUrl: '', portfolioUrl: '',
    college: '', branch: '', graduationYear: '',
  })

  useEffect(() => {
    if (user) setForm({
      name: user.name || '',
      bio:  user.bio  || '',
      location: user.location || '',
      skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
      avatar: user.avatar || '',
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || '',
      portfolioUrl: user.portfolioUrl || '',
      college: user.college || '',
      branch: user.branch || '',
      graduationYear: user.graduationYear || '',
    })
  }, [user])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile({ ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) })
      success('Profile updated! 🎉')
      setEditing(false)
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update.')
    } finally { setLoading(false) }
  }

  const score    = strength(user)
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const scoreColor = score >= 80 ? '#22C55E' : score >= 50 ? 'var(--accent)' : '#F59E0B'

  const fieldRow = (label, key, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="label">{label}</label>
      <input type={type} value={form[key]} onChange={(e) => set(key, e.target.value)}
        className="input" placeholder={placeholder} />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 page-enter relative">
      {/* Background ambient glows */}
      <div className="hero-orb-violet pointer-events-none" style={{ top: -100, right: 0, opacity: 0.3, width: 300, height: 300 }} />

      {/* ── Header ── */}
      <motion.div {...fadeUp(0)} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            {user?.avatar ? (
              <img
                src={user.avatar} alt=""
                className="h-20 w-20 rounded-[20px] object-cover shadow-xl"
                style={{ border: '2px solid var(--accent-border)' }}
              />
            ) : (
              <div
                className="h-20 w-20 rounded-[20px] flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))', border: '2px solid var(--accent-border)' }}
              >
                {initials}
              </div>
            )}
            <div
              className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center border-2 border-transparent"
              style={{ background: score >= 80 ? '#22C55E' : 'var(--accent)', borderColor: 'var(--bg-base)' }}
              title="Verified Member"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
          </motion.div>
          <div>
            <h1 className="heading-lg" style={{ fontSize: 28 }}>{user?.name || 'Your Profile'}</h1>
            <p className="body-md mt-0.5" style={{ color: 'var(--text-2)' }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge uppercase tracking-wider" style={{ fontSize: 10 }}>{user?.role || 'Developer'}</span>
              {user?.location && (
                <span className="caption flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                  {user.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <motion.button
          type="button" onClick={() => setEditing((p) => !p)}
          className={editing ? 'btn-secondary btn-sm self-start' : 'btn-gradient btn-sm self-start'}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        >
          {editing ? 'Discard Changes' : 'Edit Profile'}
        </motion.button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* About */}
                <div className="rounded-2xl p-6 space-y-4 shadow-sm"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                  <h2 className="heading-sm">About</h2>
                  <p className="body-md leading-relaxed text-[14px]">
                    {user?.bio || <span className="italic" style={{ color: 'var(--text-3)' }}>No bio provided yet. Give recruiters a quick intro about yourself!</span>}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { href: user?.githubUrl, label: 'GitHub', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" /></svg> },
                      { href: user?.linkedinUrl, label: 'LinkedIn', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                      { href: user?.portfolioUrl, label: 'Portfolio', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg> },
                    ].filter((l) => l.href).map(({ href, label, icon }) => (
                      <motion.a key={label} href={href} target="_blank" rel="noreferrer"
                        className="btn-secondary btn-sm gap-2" whileHover={{ y: -1 }}>
                        {icon} {label}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="rounded-2xl p-6 space-y-4 shadow-sm"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                  <h2 className="heading-sm">Skills & Technologies</h2>
                  {user?.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s) => (
                        <span key={s} className="tech-pill px-3 py-1.5 text-xs">{s}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="caption">No skills listed yet.</p>
                  )}
                </div>

                {/* Education */}
                {(user?.college || user?.branch || user?.graduationYear) && (
                  <div className="rounded-2xl p-6 space-y-4 shadow-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
                    <h2 className="heading-sm">Education</h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[{ l: 'Institution', v: user.college }, { l: 'Field of Study', v: user.branch }, { l: 'Class of', v: user.graduationYear }]
                        .filter((r) => r.v).map(({ l, v }) => (
                          <div key={l} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                            <p className="caption mb-1">{l}</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{v}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* Edit Form */
              <motion.form
                key="edit"
                onSubmit={handleSave}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-border)', backdropFilter: 'blur(12px)' }}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--violet))' }} />
                <h2 className="heading-sm">Edit Profile</h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  {fieldRow('Full name *', 'name', 'text', 'Your full name')}
                  {fieldRow('Location', 'location', 'text', 'City, Country')}
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="label mb-0">Bio</label>
                    <span className="caption text-[11px] font-medium" style={{ color: form.bio.length > 280 ? '#F87171' : 'var(--text-3)' }}>
                      {form.bio.length}/300
                    </span>
                  </div>
                  <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} maxLength={300}
                    rows={4} className="textarea w-full"
                    placeholder="Tell recruiters about yourself… what are you building? what are you learning?" />
                </div>

                <div>
                  <label className="label">Skills</label>
                  <input value={form.skills} onChange={(e) => set('skills', e.target.value)}
                    className="input" placeholder="React, Node.js, Python, TypeScript…" />
                  <p className="caption mt-1.5">Comma-separated list of technologies.</p>
                </div>

                <div>
                  <label className="label">Avatar URL</label>
                  <input type="url" value={form.avatar} onChange={(e) => set('avatar', e.target.value)}
                    className="input" placeholder="https://example.com/photo.jpg" />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  {fieldRow('GitHub', 'githubUrl', 'url', 'https://github.com/…')}
                  {fieldRow('LinkedIn', 'linkedinUrl', 'url', 'https://linkedin.com/in/…')}
                  {fieldRow('Portfolio', 'portfolioUrl', 'url', 'https://yoursite.dev')}
                </div>

                <div className="grid gap-5 sm:grid-cols-3 pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
                  {fieldRow('College', 'college', 'text', 'IIT Bombay')}
                  {fieldRow('Branch', 'branch', 'text', 'Computer Science')}
                  {fieldRow('Grad Year', 'graduationYear', 'text', '2025')}
                </div>

                <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary" disabled={loading}>Cancel</button>
                  <motion.button type="submit" className="btn-gradient relative overflow-hidden" disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.97 }}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                        Saving…
                      </span>
                    ) : (
                      <>
                        Save Changes
                        <div className="btn-shimmer" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <motion.div {...fadeUp(1)} className="rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
            
            {score === 100 && (
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/10 blur-xl rounded-full pointer-events-none" />
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>Profile Strength</p>
              <span className="text-sm font-bold" style={{ color: scoreColor }}>{score}%</span>
            </div>
            
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: scoreColor, boxShadow: `0 0 10px ${scoreColor}80` }}
              />
            </div>
            
            <div className="space-y-2 pt-1">
              {[
                { label: 'Add bio', done: !!user?.bio },
                { label: 'Add skills', done: !!user?.skills?.length },
                { label: 'Add avatar', done: !!user?.avatar },
                { label: 'Add GitHub', done: !!user?.githubUrl },
              ].filter((i) => !i.done).slice(0, 3).map(({ label }) => (
                <div key={label} className="flex items-center gap-2.5 caption">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--text-3)' }} />
                  {label}
                </div>
              ))}
              {score === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm font-medium pt-1" style={{ color: '#22C55E' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                  All-Star Profile!
                </motion.div>
              )}
            </div>
            {score < 100 && !editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary w-full justify-center mt-2" style={{ height: 32, fontSize: 12 }}>
                Complete Profile
              </button>
            )}
          </motion.div>

          {/* Account Meta */}
          <motion.div {...fadeUp(2)} className="rounded-2xl p-5 space-y-4 shadow-sm"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
            <p className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>Account</p>
            <div className="space-y-3">
              {[
                { label: 'Role', value: user?.role },
                { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-[12.5px]">
                  <span style={{ color: 'var(--text-3)' }}>{label}</span>
                  <span className="font-semibold capitalize" style={{ color: 'var(--text-1)' }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
