export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="secondary-button text-sm"
          >
            ✕ Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  )
}
