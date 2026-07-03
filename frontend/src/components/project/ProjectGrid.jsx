import ProjectCard from './ProjectCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function ProjectGrid({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="surface-card h-96 animate-pulse p-6" />
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="There are no projects matching your search yet. Create the first showcase project and invite others to explore it."
        actionLabel="Create a project"
        actionUrl="/projects/create"
      />
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id || project.id} project={project} />
      ))}
    </div>
  )
}
