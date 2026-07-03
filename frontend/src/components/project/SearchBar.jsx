export default function SearchBar({ searchTerm, onSearch, technologies, selectedTech, onSelectTech, onClearFilter }) {
  return (
    <div className="surface-card rounded-[32px] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <label
            htmlFor="project-search"
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by title, description or technology"
            className="input-field mt-2 w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {technologies.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => onSelectTech(tech)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedTech === tech
                  ? 'bg-sky-500 text-white'
                  : 'secondary-button'
              }`}
            >
              {tech}
            </button>
          ))}
          <button type="button" onClick={onClearFilter} className="secondary-button">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
