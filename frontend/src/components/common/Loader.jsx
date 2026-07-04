export default function Loader({ size = 20, className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-2 animate-spin shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: 'var(--border-strong)',
        borderTopColor: 'var(--accent)',
      }}
    />
  )
}
