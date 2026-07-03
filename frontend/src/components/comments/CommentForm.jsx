import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'

export default function CommentForm({
  initialValue = '',
  onSubmit,
  submitting,
  placeholder = 'Write a comment…',
  isEditing = false,
  onCancelEdit,
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    if (!isEditing) setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[32px] p-6 space-y-4">
      <label
        className="block text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {isEditing ? 'Edit your comment' : 'Your comment'}
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="input-field w-full resize-none"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isEditing
            ? 'Make your changes then click Update.'
            : 'Share helpful feedback for the creator.'}
        </p>
        <div className="flex gap-2">
          {isEditing && onCancelEdit && (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting || !value.trim()}>
            {submitting ? 'Posting…' : isEditing ? 'Update' : 'Post comment'}
          </Button>
        </div>
      </div>
    </form>
  )
}
