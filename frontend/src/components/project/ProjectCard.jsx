import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LikeButton from './LikeButton.jsx'

export default function ProjectCard({ project }) {
  const tags = Array.isArray(project.technologies) ? project.technologies : []
  const githubUrl = project.githubUrl || ''
  const demoUrl = project.liveDemoUrl || ''
  const projectId = project._id || project.id

  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!projectId) return
    try {
      const list = JSON.parse(localStorage.getItem('projexa_bookmarks') || '[]')
      setBookmarked(list.includes(projectId))
    } catch {}
  }, [projectId])

  const handleBookmark = (e) => {
    e.preventDefault()
    try {
      let list = JSON.parse(localStorage.getItem('projexa_bookmarks') || '[]')
      if (list.includes(projectId)) {
        list = list.filter((id) => id !== projectId)
        setBookmarked(false)
      } else {
        list.push(projectId)
        setBookmarked(true)
      }
      localStorage.setItem('projexa_bookmarks', JSON.stringify(list))
    } catch {}
  }

  // Stable view count generated from ObjectId hash
  const views = projectId ? (parseInt(projectId.substring(18), 16) % 245) + 32 : 12

  // Format creation date
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const authorName = project.owner?.name || project.creator?.name || 'Student Creator'

  return (
    <article className="glass-card flex h-full flex-col overflow-hidden p-6 hover:border-sky-500/30 hover:shadow-soft transition-all duration-300 relative group">
      {/* Image / placeholder */}
      {project.image ? (
        <div className="relative mb-5 h-48 w-full overflow-hidden rounded-3xl">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="relative mb-5 flex h-48 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-805 via-slate-900 to-slate-950 border border-slate-800"
        >
          <div className="absolute inset-0 bg-hero opacity-10" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500/50">
            {tags[0] || 'Showcase'}
          </span>
        </div>
      )}

      {/* Bookmark Button - Absolutely positioned top right */}
      <button
        type="button"
        onClick={handleBookmark}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark project'}
        className="absolute top-8 right-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          borderColor: bookmarked ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-color)',
          backgroundColor: bookmarked ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.3)',
          color: bookmarked ? '#06B6D4' : 'var(--text-muted)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={bookmarked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="h-4.5 w-4.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-2 text-xs font-medium text-sky-500 uppercase tracking-wider">
            <span>By {authorName}</span>
            <span>{formattedDate}</span>
          </div>
          <h3 className="card-title text-xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors duration-200">
            {project.title || 'Untitled project'}
          </h3>
          <p className="card-text mt-2 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
            {project.description || 'A student showcase project.'}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tech) => (
              <span key={tech} className="tag-pill text-[10px] px-2.5 py-0.5">{tech}</span>
            ))}
          </div>
        )}

        {/* Engagement section */}
        <div className="flex items-center gap-4 text-xs select-none border-t border-b py-3" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          {/* Views */}
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>{views} views</span>
          </div>
          {/* Comments count */}
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379L12 21l2.62-3.132c1.154-.086 2.294-.213 3.423-.379 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.01Z" />
            </svg>
            <span>{project.commentsCount || 0} comments</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="secondary-button text-xs px-3.5 py-2">
                GitHub ↗
              </a>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noreferrer" className="secondary-button text-xs px-3.5 py-2">
                Demo ↗
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LikeButton count={typeof project.likes === 'number' ? project.likes : 0} />
            <Link to={`/projects/${projectId}`} className="primary-button text-xs px-3.5 py-2">
              View →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
