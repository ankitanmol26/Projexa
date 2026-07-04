import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="text-center space-y-5 max-w-sm"
      >
        <p className="font-bold" style={{ fontSize: 80, lineHeight: 1, color: 'var(--bg-elevated)', letterSpacing: '-0.04em' }}>404</p>
        <div>
          <h1 className="heading-md">Page not found</h1>
          <p className="body-sm mt-2">The page you're looking for doesn't exist or was moved.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-sm">← Go back</button>
          <Link to="/" className="btn-gradient btn-sm">Home</Link>
        </div>
      </motion.div>
    </div>
  )
}
