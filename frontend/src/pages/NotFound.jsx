import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card max-w-lg w-full rounded-[40px] p-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-500">404 error</p>
        <h1 className="section-heading mt-2">Page not found</h1>
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
          The page you are trying to reach does not exist.
        </p>
        <Link to="/" className="primary-button mt-8 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  )
}
