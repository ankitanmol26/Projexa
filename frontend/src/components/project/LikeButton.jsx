export default function LikeButton({ count = 0, active = false, onClick }) {
  const isClickable = typeof onClick === 'function'
  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      aria-label={active ? 'Unlike project' : 'Like project'}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-200 ${
        isClickable ? 'hover:-translate-y-0.5 cursor-pointer active:scale-95' : 'cursor-default'
      } ${
        active
          ? 'border-rose-400 bg-rose-500/10 text-rose-600 dark:text-rose-400'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className={`w-3.5 h-3.5 ${active ? 'text-rose-500' : 'text-slate-400'}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <span>{count}</span>
    </button>
  )
}
