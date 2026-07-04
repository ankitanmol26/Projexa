import { AnimatePresence, motion } from 'framer-motion'
import CommentCard from './CommentCard.jsx'

export default function CommentList({ comments, currentUser, onEdit, onDelete }) {
  if (!comments || comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl px-5 py-10 text-center"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-3)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227L12 21l2.62-3.132c1.584-.233 2.707-1.626 2.707-3.228V6.741" />
        </svg>
        <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>No comments yet</p>
        <p className="caption mt-1">Be the first to leave feedback.</p>
      </motion.div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="px-5">
        <AnimatePresence initial={false}>
          {comments.map((c) => (
            <CommentCard
              key={c._id || c.id}
              comment={c}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
