import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card max-w-lg w-full rounded-[40px] p-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Unauthorized</p>
        <h1 className="section-heading mt-2">Access blocked</h1>
        <p className="mt-4 text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
          You need to sign in with the correct account to access this page.
        </p>
        <Link to="/login" className="primary-button mt-8 inline-flex">
          Login now
        </Link>
      </div>
    </div>
  )
}
