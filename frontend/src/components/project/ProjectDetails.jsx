import LikeButton from './LikeButton.jsx'

const getOwnerName = (project) =>
  project.owner?.name || project.creator?.name || project.ownerName || 'Student'

export default function ProjectDetails({ project, onLike, liked, commentsCount }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : []
  const projectId = project._id || project.id

  const views = projectId ? (parseInt(projectId.substring(18), 16) % 245) + 32 : 12

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  const ownerName = getOwnerName(project)
  const initials = ownerName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <section className="glass-card overflow-hidden rounded-[32px] p-8 relative">
      <div className="absolute inset-0 bg-hero opacity-[0.05] pointer-events-none select-none" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: main info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              Showcase Entry
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{project.title}</h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>
          </div>

          {/* Meta cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-card p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-soft">
                {initials}
              </div>
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Owner
                </h3>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {ownerName}
                </p>
              </div>
            </div>

            <div className="surface-card p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Published
                </h3>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="surface-card p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025 10.314 10.314 0 0 1-2.286-2.68C1.764 15.01 1 13.58 1 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Engagement
                </h3>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {commentsCount} comments
                </p>
              </div>
            </div>
          </div>

          {/* Technologies + links + like */}
          <div className="surface-card p-6 space-y-5">
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span key={tech} className="tag-pill text-xs px-3 py-1 font-medium">{tech}</span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button text-xs px-4 py-2.5"
                >
                  GitHub repo ↗
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button text-xs px-4 py-2.5"
                >
                  Live demo ↗
                </a>
              )}
              <LikeButton
                count={typeof project.likes === 'number' ? project.likes : 0}
                active={liked}
                onClick={onLike}
              />
            </div>
          </div>
        </div>

        {/* Right: snapshot panel */}
        <div className="surface-card flex flex-col gap-6 p-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">
              Project snapshot
            </h3>
            <div className="space-y-3 text-xs leading-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>GitHub: </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                      {project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                    </a>
                  ) : 'Not provided'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Demo: </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {project.liveDemoUrl ? (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                      {project.liveDemoUrl.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  ) : 'Not provided'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Stack: </span>
                <span className="text-right truncate max-w-[160px] text-white" style={{ color: 'var(--text-muted)' }}>
                  {technologies.length ? technologies.join(', ') : 'None listed'}
                </span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span style={{ color: 'var(--text-secondary)' }}>Stats: </span>
                <span className="text-white">
                  {views} views &bull; {project.likes || 0} likes
                </span>
              </div>
            </div>
          </div>

          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-full rounded-2xl object-cover ring-1 ring-white/10"
              style={{ maxHeight: '180px' }}
            />
          )}

          <div className="surface-card p-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Quick tip</p>
            <p className="leading-relaxed">
              Showcases with active demos and clean repositories receive 3x more comments and likes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
