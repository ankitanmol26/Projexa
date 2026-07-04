import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* Deterministic pseudo-view-count from project id */
function pseudoViews(id) {
  if (!id) return 0
  const hex = id.length >= 24 ? id.slice(18) : id.slice(-6)
  return (parseInt(hex, 16) % 2450) + 320
}

/* Color-code tech badges by stack */
const TECH_COLORS = {
  React:       'tech-pill-react',
  'React.js':  'tech-pill-react',
  'Next.js':   'tech-pill-next',
  NextJS:      'tech-pill-next',
  'Node.js':   'tech-pill-node',
  NodeJS:      'tech-pill-node',
  Express:     'tech-pill-node',
  MongoDB:     'tech-pill-mongo',
  Mongo:       'tech-pill-mongo',
  TypeScript:  'tech-pill-ts',
  TS:          'tech-pill-ts',
  Python:      'tech-pill-python',
  Docker:      'tech-pill-docker',
}

function getTechClass(tech) {
  for (const [key, cls] of Object.entries(TECH_COLORS)) {
    if (tech.toLowerCase().includes(key.toLowerCase())) return cls
  }
  return ''
}

export default function ProjectCard({ project, index = 0 }) {
  const id      = project._id || project.id
  const tags    = Array.isArray(project.technologies) ? project.technologies : []
  const views   = pseudoViews(id)
  const owner   = project.owner?.name || project.creator?.name || 'Developer'
  const avatar  = project.owner?.avatar || ''
  const initials = owner.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const [bookmarked, setBookmarked]   = useState(false)
  const [liked, setLiked]             = useState(false)
  const [likeCount, setLikeCount]     = useState(project.likes || 0)
  const [likeAnim, setLikeAnim]       = useState(false)
  const [shared, setShared]           = useState(false)
  const shareTimeout = useRef(null)

  useEffect(() => {
    if (!id) return
    try {
      const bm   = JSON.parse(localStorage.getItem('projexa_bookmarks') || '[]')
      const lk   = JSON.parse(localStorage.getItem('projexa_liked') || '[]')
      setBookmarked(bm.includes(id))
      setLiked(lk.includes(id))
    } catch {}
  }, [id])

  const toggleBookmark = (e) => {
    e.preventDefault(); e.stopPropagation()
    try {
      let list = JSON.parse(localStorage.getItem('projexa_bookmarks') || '[]')
      list = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
      localStorage.setItem('projexa_bookmarks', JSON.stringify(list))
      setBookmarked(list.includes(id))
    } catch {}
  }

  const toggleLike = (e) => {
    e.preventDefault(); e.stopPropagation()
    try {
      let list = JSON.parse(localStorage.getItem('projexa_liked') || '[]')
      const wasLiked = list.includes(id)
      list = wasLiked ? list.filter((x) => x !== id) : [...list, id]
      localStorage.setItem('projexa_liked', JSON.stringify(list))
      setLiked(!wasLiked)
      setLikeCount((c) => wasLiked ? c - 1 : c + 1)
      if (!wasLiked) {
        setLikeAnim(true)
        setTimeout(() => setLikeAnim(false), 500)
      }
    } catch {}
  }

  const handleShare = (e) => {
    e.preventDefault(); e.stopPropagation()
    const url = `${window.location.origin}/projects/${id}`
    navigator.clipboard?.writeText(url).catch(() => {})
    setShared(true)
    clearTimeout(shareTimeout.current)
    shareTimeout.current = setTimeout(() => setShared(false), 2000)
  }

  const date = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
      className="group flex flex-col overflow-hidden rounded-2xl card-hover-glow"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* ── Thumbnail ── */}
      <div className="relative h-48 overflow-hidden shrink-0" style={{ background: 'var(--bg-elevated)' }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Gradient mesh background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.18) 0%, transparent 55%),
                  radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.15) 0%, transparent 55%)
                `,
              }}
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative flex flex-col items-center gap-2 z-10">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                }}
              >
                {(project.title || 'P')[0].toUpperCase()}
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-3)' }}>{tags[0] || 'Project'}</span>
            </div>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Bookmark button */}
        <motion.button
          type="button"
          onClick={toggleBookmark}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          aria-pressed={bookmarked}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: bookmarked ? 'var(--accent)' : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
        >
          <motion.svg
            className="w-3.5 h-3.5"
            fill={bookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            animate={{ scale: bookmarked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </motion.svg>
        </motion.button>

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="badge-amber text-[10px]">⭐ Featured</span>
          </div>
        )}

        {/* Tags visible on image (bottom-left) */}
        {tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
            {tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(8px)',
                  color: '#E5E7EB',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-3.5 p-4">

        {/* Author + date */}
        <div className="flex items-center justify-between gap-2">
          <Link to={`/profile`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 min-w-0 group/author">
            {avatar ? (
              <img
                src={avatar}
                alt={owner}
                className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-offset-1"
                style={{ ringColor: 'var(--accent-border)', ringOffsetColor: 'var(--bg-card)' }}
              />
            ) : (
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                  outline: '2px solid var(--accent-border)',
                  outlineOffset: '1px',
                }}
              >
                {initials}
              </div>
            )}
            <span
              className="text-[12.5px] font-medium truncate transition-colors duration-150"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-1)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}
            >
              {owner}
            </span>
          </Link>
          {date && <span className="caption text-[11px] shrink-0">{date}</span>}
        </div>

        {/* Title */}
        <Link to={`/projects/${id}`}>
          <h3
            className="font-semibold text-[14.5px] leading-snug line-clamp-2 transition-colors duration-150"
            style={{ color: 'var(--text-1)', letterSpacing: '-0.015em' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-1)'}
          >
            {project.title || 'Untitled'}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[12.5px] leading-relaxed line-clamp-2 flex-1" style={{ color: 'var(--text-3)' }}>
          {project.description || 'No description.'}
        </p>

        {/* Tech tags — colored */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((t) => (
              <span key={t} className={`tech-pill text-[11px] ${getTechClass(t)}`}>{t}</span>
            ))}
            {tags.length > 4 && (
              <span className="tech-pill text-[11px]">+{tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Stats + actions */}
        <div
          className="flex items-center justify-between gap-2 pt-3 mt-auto"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {/* Engagement counts */}
          <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--text-3)' }}>

            {/* Animated Like button */}
            <motion.button
              type="button"
              onClick={toggleLike}
              aria-label={liked ? 'Unlike' : 'Like'}
              className="flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
              style={{ color: liked ? '#F87171' : 'var(--text-3)', border: 'none', background: 'none', padding: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg
                className="w-3.5 h-3.5"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                animate={likeAnim ? { scale: [1, 1.5, 0.85, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </motion.svg>
              <span style={{ color: liked ? '#F87171' : 'var(--text-3)' }}>{likeCount}</span>
            </motion.button>

            {/* Comments */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227L12 21l2.62-3.132c1.584-.233 2.707-1.626 2.707-3.228V6.741" />
              </svg>
              {project.commentsCount || 0}
            </span>

            {/* Views */}
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {views.toLocaleString()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">

            {/* Share button */}
            <motion.button
              type="button"
              onClick={handleShare}
              aria-label="Copy link"
              className="btn-icon relative overflow-hidden"
              style={{ height: 28, width: 28 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
            >
              <AnimatePresence mode="wait">
                {shared ? (
                  <motion.svg
                    key="check"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="w-3.5 h-3.5"
                    style={{ color: '#22C55E' }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="share"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            {/* GitHub */}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-icon"
                style={{ height: 28, width: 28 }}
                aria-label="GitHub"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                title="GitHub"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>
            )}

            {/* Live Demo */}
            {project.liveDemoUrl && (
              <motion.a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-icon"
                style={{ height: 28, width: 28 }}
                aria-label="Live demo"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                title="Live Demo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </motion.a>
            )}

            {/* View details */}
            <Link
              to={`/projects/${id}`}
              className="btn-secondary btn-sm"
              style={{ height: 28, padding: '0 10px', fontSize: 11.5 }}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
