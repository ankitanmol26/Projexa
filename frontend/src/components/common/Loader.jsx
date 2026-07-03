export default function Loader({ size = 12 }) {
  return (
    <div className="inline-flex items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-transparent"
        style={{ width: size * 2, height: size * 2 }}
      />
    </div>
  )
}
