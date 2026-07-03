export default function Input({ label, id, error, ...props }) {
  return (
    <label
      htmlFor={id}
      className="block text-left text-sm font-medium"
      style={{ color: 'var(--text-secondary)' }}
    >
      {label}
      <input id={id} className="input-field mt-2" {...props} />
      {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}
    </label>
  )
}
