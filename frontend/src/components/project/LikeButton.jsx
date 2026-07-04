import { motion } from 'framer-motion'

export default function LikeButton({ count = 0, active = false, onClick }) {
  const clickable = typeof onClick === 'function'
  return (
    <motion.button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      aria-label={active ? 'Unlike' : 'Like'}
      aria-pressed={active}
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.93 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
      style={{
        background: active ? 'var(--red-dim)' : 'var(--bg-elevated)',
        border: `1px solid ${active ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        color: active ? '#F87171' : 'var(--text-2)',
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <motion.svg
        className="w-3.5 h-3.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </motion.svg>
      <span>{count}</span>
    </motion.button>
  )
}
