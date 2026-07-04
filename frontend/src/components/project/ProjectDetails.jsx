import { motion } from 'framer-motion'
import LikeButton from './LikeButton.jsx'

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

export default function ProjectDetails({ project, onLike, liked, commentsCount }) {
  const id   = project._id || project.id
  const tags = Array.isArray(project.technologies) ? project.technologies : []
  const views = pseudoViews(id)
  const owner  = project.owner?.name || project.creator?.name || 'Developer'
  const ownerAvatar = project.owner?.avatar || ''
  const ownerInitials = owner.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const date = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Background ambient glow behind header */}
      <div className="hero-orb-blue pointer-events-none" style={{ top: -100, left: '10%', opacity: 0.15, width: 400, height: 400 }} />

      <div
        className="rounded-2xl overflow-hidden shadow-2xl relative z-10"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(24px)' }}
      >
        {/* Project image / Banner */}
        <div className="relative overflow-hidden" style={{ height: 420, background: 'var(--bg-elevated)' }}>
          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                className="h-24 w-24 rounded-[28px] flex items-center justify-center text-5xl font-bold text-white shadow-2xl z-10"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
              >
                {(project.title || 'P')[0].toUpperCase()}
              </motion.div>
            </div>
          )}

          {/* Bottom gradient overlay for image */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Floating tags over image (bottom left) */}
          {tags.length > 0 && (
            <div className="absolute bottom-6 left-8 flex flex-wrap gap-2 z-10">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg"
                  style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Floating actions over image (bottom right) */}
          <div className="absolute bottom-6 right-8 flex items-center gap-3 z-10">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary btn-sm gap-2" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" /></svg>
                Code
              </a>
            )}
            {project.liveDemoUrl && (
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="btn-gradient btn-sm gap-2 relative overflow-hidden">
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                <span className="relative z-10">Live Demo</span>
                <div className="btn-shimmer" />
              </motion.a>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="p-8 space-y-8">
          
          {/* Header Row (Title + Badges) */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge-green px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full inline-block mr-1" style={{ background: 'currentColor', animation: 'pulseDot 2s ease-in-out infinite' }} />
                  {project.status || 'Published'}
                </span>
                {project.isFeatured && <span className="badge-amber px-2.5 py-1">⭐ Featured</span>}
              </div>
              <h1 className="heading-lg" style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
                {project.title}
              </h1>
            </div>

            {/* Like Box */}
            <div className="shrink-0 flex md:flex-col items-center gap-3 md:gap-1 p-3 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <LikeButton count={typeof project.likes === 'number' ? project.likes : 0} active={liked} onClick={onLike} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-3)' }}>{project.likes || 0} Likes</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-2)', letterSpacing: '-0.01em' }}>
              {project.description}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            
            {/* Author */}
            <div className="col-span-2 md:col-span-1 rounded-xl p-4 space-y-3 shadow-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <p className="caption text-[11px] uppercase tracking-wider font-semibold">Creator</p>
              <div className="flex items-center gap-3">
                {ownerAvatar ? (
                  <img src={ownerAvatar} alt={owner} className="h-9 w-9 rounded-full object-cover shrink-0 ring-2 ring-offset-2" style={{ ringColor: 'var(--border)', ringOffsetColor: 'var(--bg-elevated)' }} />
                ) : (
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}>
                    {ownerInitials}
                  </div>
                )}
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-1)' }}>{owner}</p>
              </div>
            </div>

            {/* Published */}
            <div className="rounded-xl p-4 space-y-1 shadow-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <p className="caption text-[11px] uppercase tracking-wider font-semibold mb-2">Published</p>
              <p className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{date || 'Recently'}</p>
            </div>

            {/* Views */}
            <div className="rounded-xl p-4 space-y-1 shadow-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <p className="caption text-[11px] uppercase tracking-wider font-semibold mb-2">Views</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>{views.toLocaleString()}</p>
            </div>

            {/* Comments count */}
            <div className="rounded-xl p-4 space-y-1 shadow-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <p className="caption text-[11px] uppercase tracking-wider font-semibold mb-2">Comments</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>{commentsCount}</p>
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}
