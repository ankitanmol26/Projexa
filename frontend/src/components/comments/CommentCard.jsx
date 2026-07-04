import { motion } from 'framer-motion'

export default function CommentCard({ comment, currentUser, onEdit, onDelete }) {
  const ownerId  = currentUser?._id || currentUser?.id
  const authorId = comment.author?._id || comment.author?.id || comment.author
  const canEdit  = ownerId && authorId && String(ownerId) === String(authorId)
  const name     = comment.author?.name || 'Anonymous'
  const avatar   = comment.author?.avatar || ''
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const date     = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22 }}
      className="flex gap-3 py-4"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Avatar */}
      {avatar ? (
        <img src={avatar} alt={name} className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5" />
      ) : (
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))' }}
        >
          {initials}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{name}</span>
          {date && <span className="caption">{date}</span>}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
          {comment.content || comment.text || ''}
        </p>
      </div>

      {/* Actions — own comments only */}
      {canEdit && (
        <div className="flex items-start gap-1 shrink-0 mt-0.5">
          <motion.button
            type="button"
            onClick={() => onEdit(comment)}
            className="btn-icon"
            style={{ height: 26, width: 26 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Edit comment"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onDelete(comment)}
            className="btn-icon"
            style={{ height: 26, width: 26, color: '#F87171' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Delete comment"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
