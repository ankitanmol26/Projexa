import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Input({
  label,
  id,
  error,
  size = 'md',
  hint,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false)
  const inputCls = size === 'lg' ? 'input-lg' : 'input'

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Focus glow ring — animated */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                boxShadow: `0 0 0 3px var(--accent-dim)`,
                borderRadius: 'inherit',
              }}
            />
          )}
        </AnimatePresence>

        <input
          id={id}
          className={`${inputCls} ${error ? 'border-red-500/60' : ''} ${className}`}
          style={error ? { borderColor: 'rgba(239,68,68,0.55)' } : {}}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
          {...props}
        />
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            id={`${id}-err`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs"
            style={{ color: '#F87171' }}
          >
            {error}
          </motion.p>
        ) : hint ? (
          <p key="hint" id={`${id}-hint`} className="caption">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
