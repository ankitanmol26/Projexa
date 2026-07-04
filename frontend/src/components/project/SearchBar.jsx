import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SearchBar({ searchTerm, onSearch, technologies = [], selectedTech, onSelectTech, onClearFilter }) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}
    >
      {/* Search input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            style={{ color: focused ? 'var(--accent)' : 'var(--text-3)', transition: 'color 0.2s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search projects, tech, developers…"
          className="input pl-9"
          style={{
            boxShadow: focused ? '0 0 0 3px var(--accent-dim)' : 'none',
            borderColor: focused ? 'var(--border-focus)' : 'var(--border)',
          }}
          aria-label="Search"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearch('')}
            className="absolute inset-y-0 right-3 flex items-center"
            style={{ color: 'var(--text-3)' }}
            aria-label="Clear"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tech filters */}
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {technologies.map((tech) => {
            const active = selectedTech === tech
            return (
              <motion.button
                key={tech}
                type="button"
                onClick={() => onSelectTech(tech)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="transition-all duration-150"
                style={{
                  height: 26,
                  padding: '0 10px',
                  fontSize: 12,
                  borderRadius: 7,
                  fontWeight: 500,
                  border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  cursor: 'pointer',
                }}
              >
                {tech}
              </motion.button>
            )
          })}
          {(searchTerm || selectedTech !== 'All') && (
            <button
              type="button"
              onClick={onClearFilter}
              className="caption"
              style={{ color: 'var(--text-3)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}
