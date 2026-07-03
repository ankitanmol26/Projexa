import { Link } from 'react-router-dom'

export default function Sidebar({ items = [] }) {
  return (
    <aside className="glass-card w-full max-w-sm space-y-4 p-6">
      <h2 className="text-lg font-semibold text-white">Quick links</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
