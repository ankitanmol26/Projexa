import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionUrl,
  icon,
  action,        // optional: custom JSX instead of link button
}) {
  return (
    <motion.div
      className="empty-state relative overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--bg-card)',
        border: '1px dashed var(--border-strong)',
        backdropFilter: 'blur(12px)',
        padding: '3rem 2rem',
        borderRadius: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 50% -20%, var(--accent), transparent 60%)' }} />

      {icon && (
        <motion.div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl relative z-10"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            color: 'var(--text-2)'
          }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="scale-125">{icon}</div>
        </motion.div>
      )}

      <h3 className="heading-md mb-2 relative z-10">{title}</h3>
      <p className="body-md max-w-sm mb-6 text-balance relative z-10" style={{ color: 'var(--text-2)' }}>{description}</p>

      <div className="relative z-10">
        {action}
        {!action && actionUrl && actionLabel && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to={actionUrl} className="btn-gradient btn-sm relative overflow-hidden">
              <span className="relative z-10">{actionLabel}</span>
              <div className="btn-shimmer" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
