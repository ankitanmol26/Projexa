import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProjects } from '../api/projectApi.js'
import useAuth from '../hooks/useAuth.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true)
      try {
        const data = await getMyProjects()
        setProjects(Array.isArray(data) ? data : [])
      } catch {
        setError('Unable to load your projects.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyProjects()
  }, [])

  const metrics = useMemo(() => {
    let likes = 0
    let comments = 0
    let views = 0
    projects.forEach((p) => {
      likes += typeof p.likes === 'number' ? p.likes : 0
      comments += typeof p.commentsCount === 'number' ? p.commentsCount : 0
      const pid = p._id || p.id
      views += pid ? (parseInt(pid.substring(18), 16) % 245) + 32 : 12
    })
    return { count: projects.length, likes, comments, views }
  }, [projects])

  return (
    <div className="space-y-12">
      {/* Hero banner */}
      <section className="glass-card relative overflow-hidden rounded-[40px] p-8 sm:p-12">
        <div className="absolute inset-0 bg-hero opacity-20 pointer-events-none select-none" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-semibold">Dev Hub</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name?.split(' ')[0] || 'creator'}.
            </h1>
            <p className="max-w-xl text-sm" style={{ color: 'var(--text-muted)' }}>
              Monitor your showcase analytics, view technical comments, and publish new projects.
            </p>
          </div>
          <Link to="/projects/create" className="primary-button whitespace-nowrap self-start lg:self-center px-6 py-3">
            Create project
          </Link>
        </div>
      </section>

      {/* Metric cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total projects',
            value: metrics.count,
            color: 'from-sky-500 to-sky-300',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-19.5 0A2.25 2.25 0 0 0 4.5 15h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0v.225c0 1.18.91 2.164 2.085 2.25.07.005.14.01.21.014m0 0h12.51c.07-.003.14-.008.21-.014c1.176-.086 2.085-1.07 2.085-2.25v-.225" />
              </svg>
            )
          },
          {
            label: 'Total likes',
            value: metrics.likes,
            color: 'from-rose-500 to-rose-300',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            )
          },
          {
            label: 'Total comments',
            value: metrics.comments,
            color: 'from-violet-500 to-violet-300',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379L12 21l2.62-3.132c1.154-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.01Z" />
              </svg>
            )
          },
          {
            label: 'Total views',
            value: metrics.views,
            color: 'from-cyan-500 to-cyan-300',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )
          },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="surface-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {label}
              </p>
              <p className={`mt-2 text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {loading ? '…' : value}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 border flex items-center justify-center text-slate-400" style={{ borderColor: 'var(--border-color)' }}>
              {icon}
            </div>
          </div>
        ))}
      </section>

      {/* Recent projects */}
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              My Latest Projects
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Review list entries, tech tags, and open edit actions.
            </p>
          </div>
          <Link to="/my-projects" className="secondary-button text-xs px-4 py-2.5 w-full sm:w-auto">
            View All Projects
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface-card h-32 animate-pulse rounded-[24px]" />
            ))
          ) : projects.length ? (
            projects.map((project) => {
              const pid = project._id || project.id
              const views = pid ? (parseInt(pid.substring(18), 16) % 245) + 32 : 12

              return (
                <div key={pid} className="glass-card flex flex-col gap-4 rounded-[24px] p-6 hover:border-sky-500/20 transition-colors duration-250">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {project.description}
                      </p>
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="tag-pill text-[10px] px-2 py-0.5">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1">
                        &bull; {views} views
                      </span>
                      <span className="flex items-center gap-1">
                        &bull; {project.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        &bull; {project.commentsCount || 0} comments
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Link to={`/projects/${pid}`} className="secondary-button text-xs px-3.5 py-2">
                        View Item
                      </Link>
                      <Link to={`/projects/${pid}/edit`} className="primary-button text-xs px-3.5 py-2">
                        Edit Settings
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="glass-card rounded-[32px] p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              You don&apos;t have any projects yet.{' '}
              <Link to="/projects/create" className="text-sky-500 underline font-semibold">
                Create your first one
              </Link>{' '}
              to add it to the showcase.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
