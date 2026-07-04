import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="h-48 skeleton" />
      <div className="p-4 space-y-3.5 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 rounded-full skeleton shrink-0" />
          <div className="h-3 w-24 skeleton rounded" />
        </div>
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-4/5 skeleton rounded" />
        
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 w-14 skeleton rounded-full" />
          <div className="h-5 w-16 skeleton rounded-full" />
        </div>

        <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex gap-3">
            <div className="h-3 w-8 skeleton rounded" />
            <div className="h-3 w-8 skeleton rounded" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-7 w-7 skeleton rounded-lg" />
            <div className="h-7 w-12 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectGrid({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Try a different search or filter. Or be the first to create a project."
        actionLabel="Create a project"
        actionUrl="/projects/create"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {projects.map((p, i) => (
        <ProjectCard key={p._id || p.id} project={p} index={i} />
      ))}
    </motion.div>
  )
}
