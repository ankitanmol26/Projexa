import { Link } from 'react-router-dom'

export default function EmptyState({ title, description, actionLabel, actionUrl }) {
  return (
    <div className="glass-card flex min-h-[240px] flex-col items-center justify-center gap-4 p-10 text-center">
      <div
        className="rounded-3xl px-5 py-4 text-2xl font-semibold"
        style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--text-primary)' }}
      >
        😌
      </div>
      <div>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>
      {actionUrl && (
        <Link to={actionUrl} className="primary-button">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
