import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth.js'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skills: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    avatar: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const calculateCompleteness = () => {
    let score = 0
    if (user?.name) score += 15
    if (user?.bio) score += 20
    if (user?.location) score += 15
    if (Array.isArray(user?.skills) && user.skills.length > 0) score += 20
    if (user?.githubUrl) score += 10
    if (user?.linkedinUrl) score += 10
    if (user?.portfolioUrl) score += 10
    return score
  }

  const completeness = calculateCompleteness()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      const payload = {
        ...formData,
        skills: skillsArray
      }

      await updateProfile(payload)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || err.message || 'Failed to update profile.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Fallback for avatar initials
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <section className="glass-card overflow-hidden rounded-[32px] p-8 sm:p-10 relative">
        <div className="absolute inset-0 bg-hero opacity-10 select-none pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-semibold">Account Dashboard</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Your Developer Profile</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Manage your personal credentials, resume highlights, and active portfolio connections.
            </p>
          </div>
          <button type="button" onClick={logout} className="secondary-button whitespace-nowrap self-start sm:self-center">
            Sign out
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details or Edit form */}
        <div className="lg:col-span-2 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-2xl border text-sm ${
              message.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
            }`}>
              {message.text}
            </div>
          )}

          {!isEditing ? (
            <div className="glass-card rounded-[32px] p-8 space-y-6">
              {/* Profile Card Info */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-20 w-`20` rounded-2xl object-cover ring-2 ring-sky-500/20" style={{ width: '80px', height: '80px' }} />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl font-bold text-white leading-none">{user?.name || 'Student Developer'}</h2>
                    <span className="tag-pill text-[10px] px-2 py-0.5 capitalize">{user?.role || 'student'}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
                  {user?.location && (
                    <div className="flex items-center gap-1 justify-center sm:justify-start text-xs" style={{ color: 'var(--text-muted)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {user.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Bio & Social */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-500">Bio</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {user?.bio || 'No bio provided. Write a micro bio to introduce yourself to hiring managers!'}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {user?.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" /></svg>
                      Github
                    </a>
                  )}
                  {user?.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      LinkedIn
                    </a>
                  )}
                  {user?.portfolioUrl && (
                    <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A9.049 9.049 0 0 1 21 12c0 .878-.125 1.729-.358 2.533M3.157 7.582A9.049 9.049 0 0 0 3 12c0 .878.125 1.729.358 2.533m15.956 0a9.002 9.002 0 0 0-5.845-6.791M17.157 14.533a9.002 9.002 0 0 1-5.157 6.217m-6.216-6.217a9.003 9.003 0 0 0 5.845-6.791m-5.845 6.791a9.003 9.003 0 0 1 5.157 6.217" /></svg>
                      Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-500">Skills &amp; Stacks</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(user?.skills) && user.skills.length > 0 ? (
                    user.skills.map((skill) => (
                      <span key={skill} className="tag-pill text-xs px-3 py-1 font-medium">{skill}</span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No skills set. Click Edit to add some!</span>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button type="button" onClick={() => setIsEditing(true)} className="primary-button text-sm px-6 py-2.5">
                  Edit Profile Fields
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[32px] p-8">
              <h2 className="text-xl font-bold text-white mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>Update Developer Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Ankit Anmol"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="skills" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Skills (Comma-separated)</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Node.js, Mongoose, TailwindCSS, AWS"
                    className="input-field w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Short Bio (Max 300 chars)</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    maxLength="300"
                    placeholder="Introduce yourself to other students and hiring engineering managers..."
                    rows="3"
                    className="input-field w-full resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-500">
                    {formData.bio.length}/300
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="avatar" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Avatar Image URL</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="e.g. https://images.unsplash.com/... or cloud path"
                    className="input-field w-full"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="githubUrl" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>GitHub URL</label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://github.com/username"
                      className="input-field w-full text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="linkedinUrl" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>LinkedIn URL</label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className="input-field w-full text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="portfolioUrl" className="text-xs font-semibold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="e.g. https://portfolio.dev"
                      className="input-field w-full text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="secondary-button text-sm px-6 py-2.5"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button text-sm px-6 py-2.5"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Profile completeness and engagement stats */}
        <div className="space-y-6">
          {/* Completion Card */}
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3 className="text-md font-bold text-white">Profile Strength</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span className="text-sky-400 font-bold">{completeness}% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden ring-1 ring-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Complete profiles are 4x more likely to attract attention from tech recruiters looking for junior talent.
            </p>

            {completeness < 100 && (
              <div className="pt-2">
                <p className="text-[10px] uppercase font-bold text-sky-560 tracking-wider">Top remaining tasks</p>
                <ul className="mt-2 space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {!user?.bio && <li>&bull; Write your micro bio (+20%)</li>}
                  {(!Array.isArray(user?.skills) || user?.skills.length === 0) && <li>&bull; Add your development skills (+20%)</li>}
                  {!user?.location && <li>&bull; Specify your location (+15%)</li>}
                  {(!user?.githubUrl || !user?.linkedinUrl || !user?.portfolioUrl) && <li>&bull; Add developer links (+10% each)</li>}
                </ul>
              </div>
            )}
          </div>

          {/* Access / Features Card */}
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3 className="text-md font-bold text-white">Platform Credentials</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Your current role provides full validation access for MERN-based sandbox items:
            </p>
            <div className="grid gap-3">
              {[
                { label: 'Create Projects', desc: 'Unlimited showcase repositories' },
                { label: 'Write Comments', desc: 'Contribute technical reviews' },
                { label: 'Likes & Votes', desc: 'Interact with community' },
              ].map(({ label, desc }) => (
                <div key={label} className="surface-card p-3 rounded-2xl border" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-bold text-white">{label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
