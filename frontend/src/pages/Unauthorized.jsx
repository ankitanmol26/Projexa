import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Unauthorized() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="text-center space-y-5 max-w-sm"
      >
        <p className="font-bold" style={{ fontSize: 80, lineHeight: 1, color: 'var(--bg-elevated)', letterSpacing: '-0.04em' }}>401</p>
        <div>
          <h1 className="heading-md">Access denied</h1>
          <p className="body-sm mt-2">You don't have permission to view this page.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-sm">← Go back</button>
          <Link to="/login" className="btn-gradient btn-sm">Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}
