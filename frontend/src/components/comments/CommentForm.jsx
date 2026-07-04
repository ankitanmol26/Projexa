import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CommentForm({ initialValue = '', onSubmit, submitting, placeholder = 'Share your thoughts…', isEditing = false, onCancelEdit }) {
  const [value, setValue] = useState(initialValue)
  const [focused, setFocused] = useState(false)

  useEffect(() => { setValue(initialValue) }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    const t = value.trim()
    if (!t) return
    onSubmit(t)
    if (!isEditing) setValue('')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        maxLength={1000}
        placeholder={placeholder}
        className="textarea w-full"
        style={{
          minHeight: 80,
          boxShadow: focused ? '0 0 0 3px var(--accent-dim)' : 'none',
          borderColor: focused ? 'var(--border-focus)' : 'var(--border)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        aria-label={isEditing ? 'Edit comment' : 'Write a comment'}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="caption">{value.length}/1000</span>
        <div className="flex gap-2">
          {isEditing && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn-secondary btn-sm" disabled={submitting}>
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            disabled={submitting || !value.trim()}
            className="btn-primary btn-sm"
            whileHover={submitting || !value.trim() ? {} : { scale: 1.02, y: -0.5 }}
            whileTap={submitting || !value.trim() ? {} : { scale: 0.97 }}
          >
            {submitting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                Posting…
              </span>
            ) : isEditing ? 'Update' : 'Comment'}
          </motion.button>
        </div>
      </div>
    </motion.form>
  )
}
