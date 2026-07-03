export default function CommentCard({ comment, currentUser, onEdit, onDelete }) {
  const ownerId = currentUser?._id || currentUser?.id
  const authorId = comment.author?._id || comment.author?.id || comment.author
  const canManage = ownerId && authorId && String(ownerId) === String(authorId)
  const authorName = comment.author?.name || comment.name || 'Anonymous'
  const dateStr = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <div className="surface-card rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {authorName}
          </p>
          {dateStr && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {dateStr}
            </p>
          )}
        </div>
        {canManage && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(comment)}
              className="secondary-button text-xs px-3 py-1.5"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(comment)}
              className="inline-flex items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-400/20"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
        {comment.content || comment.text || 'No content.'}
      </p>
    </div>
  )
}
