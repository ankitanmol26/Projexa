import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { getProjects } from '../api/projectApi.js'
import ProjectGrid from '../components/project/ProjectGrid.jsx'
import SearchBar from '../components/project/SearchBar.jsx'

const TECH_PRESETS = [
  'All', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
  'TypeScript', 'Python', 'Docker', 'Java', 'AI/ML', 'Android', 'Blockchain', 'IoT', 'Cloud',
]

const STATS = [
  { value: '5,000+', label: 'Projects Shared',   icon: '🚀', color: 'var(--accent)' },
  { value: '2,500+', label: 'Developers',         icon: '👨‍💻', color: 'var(--violet)' },
  { value: '300+',   label: 'Recruiters Active',  icon: '🎯', color: '#22C55E' },
  { value: '120+',   label: 'Colleges',           icon: '🏫', color: '#F59E0B' },
]

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
})

const CODE_LINES = [
  { type: 'comment',  content: '// Projexa — Student Developer Platform' },
  { type: 'keyword',  content: 'const', rest: ' project = {' },
  { type: 'key',      content: '  title:', string: ' "AI Study Assistant",' },
  { type: 'key',      content: '  stack:', string: ' ["React", "Node", "ML"],' },
  { type: 'key',      content: '  likes:', number: ' 148,' },
  { type: 'key',      content: '  status:', string: ' "hiring_open"' },
  { type: 'bracket',  content: '}' },
]

function AnimatedCounter({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const num = parseInt(value.replace(/\D/g, ''))
    const suffix = value.replace(/[\d,]/g, '')
    let start = 0
    const step = num / 40
    const timer = setInterval(() => {
      start += step
      if (start >= num) { clearInterval(timer); setDisplay(value); return }
      setDisplay(Math.floor(start).toLocaleString() + suffix)
    }, 30)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{isInView ? display : '0'}</span>
}

export default function Home() {
  const [searchParams] = useSearchParams()
  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState(searchParams.get('search') || '')
  const [activeTech, setActiveTech] = useState('All')
  const [sort, setSort]             = useState('newest')
  const exploreRef = useRef(null)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearch(q)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProjects()
      .then((d) => {
        if (cancelled) return
        const list = Array.isArray(d) ? d : Array.isArray(d?.projects) ? d.projects : []
        setProjects(list)
      })
      .catch(() => { if (!cancelled) setError('Failed to load projects.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const techOptions = useMemo(() => {
    const s = new Set(TECH_PRESETS)
    projects.forEach((p) => (p.technologies || []).forEach((t) => s.add(t)))
    return Array.from(s)
  }, [projects])

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch = !q
        || (p.title || '').toLowerCase().includes(q)
        || (p.description || '').toLowerCase().includes(q)
        || (p.technologies || []).some((t) => t.toLowerCase().includes(q))
      const matchTech = activeTech === 'All' || (p.technologies || []).includes(activeTech)
      return matchSearch && matchTech
    })
    if (sort === 'likes')  list = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    else if (sort === 'oldest') list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  }, [projects, search, activeTech, sort])

  return (
    <div className="space-y-20">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-4 pb-8 overflow-hidden">

        {/* Background ambient orbs */}
        <div className="hero-orb-blue" style={{ top: '-100px', left: '-80px' }} />
        <div className="hero-orb-violet" style={{ top: '60px', right: '-60px' }} />

        <div className="relative grid gap-14 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-9 z-10">

            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: '#93C5FD',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: 'var(--green)', animation: 'pulseDot 2s ease-in-out infinite' }}
                />
                ✦ The #1 Student Developer Platform
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div {...fadeUp(1)} className="space-y-4">
              <h1
                className="text-balance font-extrabold"
                style={{ fontSize: 'clamp(40px, 5.8vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1.04, color: 'var(--text-1)' }}
              >
                Build.{' '}
                <span className="gradient-text">Showcase.</span>
                <br />Get Hired.
              </h1>
              <p className="body-lg max-w-[480px]" style={{ fontSize: 17, lineHeight: 1.75 }}>
                Share your projects. Connect with developers.
                Build your portfolio. Get discovered by top recruiters — all in one place.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(2)} className="flex flex-wrap gap-3">
              <motion.a
                href="#explore"
                onClick={(e) => { e.preventDefault(); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-gradient btn-lg btn-shimmer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Explore Projects
              </motion.a>
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link to="/projects/create" className="btn-secondary btn-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Project
                </Link>
              </motion.div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div {...fadeUp(3)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {STATS.map(({ value, label, icon, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  className="rounded-xl px-4 py-3.5 flex flex-col gap-1"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-xl font-bold" style={{ color, letterSpacing: '-0.03em' }}>
                    <AnimatedCounter value={value} />
                  </span>
                  <p className="text-[11px] leading-tight" style={{ color: 'var(--text-3)' }}>{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Floating Code Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block float-card z-10"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#0D1117',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex gap-1.5">
                  {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
                    <div key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 mx-3">
                  <div
                    className="px-3 py-1.5 rounded-md text-xs font-mono truncate"
                    style={{ background: '#0D1117', color: '#8B949E', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    projexa.dev/projects/ai-study-assistant
                  </div>
                </div>
              </div>

              {/* Code content */}
              <div className="p-5 font-mono text-[12.5px] leading-relaxed space-y-0.5">
                {CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                  >
                    {line.type === 'comment' && (
                      <span style={{ color: '#6A737D' }}>{line.content}</span>
                    )}
                    {line.type === 'keyword' && (
                      <span>
                        <span style={{ color: '#FF7B72' }}>{line.content}</span>
                        <span style={{ color: '#E6EDF3' }}>{line.rest}</span>
                      </span>
                    )}
                    {line.type === 'key' && (
                      <span>
                        <span style={{ color: '#79C0FF' }}>{line.content}</span>
                        {line.string && <span style={{ color: '#A5D6FF' }}>{line.string}</span>}
                        {line.number && <span style={{ color: '#F2CC60' }}>{line.number}</span>}
                      </span>
                    )}
                    {line.type === 'bracket' && (
                      <span style={{ color: '#E6EDF3' }}>{line.content}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Stats footer */}
              <div
                className="flex items-center gap-4 px-5 py-3 text-xs"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#161B22' }}
              >
                <span className="flex items-center gap-1.5" style={{ color: '#F87171' }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  148 likes
                </span>
                <span className="flex items-center gap-1.5" style={{ color: '#7D8590' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  1,842 views
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: '#22C55E', animation: 'pulseDot 2s ease-in-out infinite' }} />
                  <span style={{ color: '#22C55E' }}>Hiring Open</span>
                </span>
              </div>
            </div>

            {/* Floating badge above card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="absolute -top-4 -right-3 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
              }}
            >
              <span>🔥</span> Trending Today
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── EXPLORE ──────────────────────────────────────────────── */}
      <section id="explore" ref={exploreRef} className="scroll-mt-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="heading-md">Explore Projects</h2>
            <p className="caption mt-0.5">
              {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input"
              style={{ width: 148, height: 36, fontSize: 13 }}
              aria-label="Sort projects"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="likes">Most liked</option>
            </select>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/projects/create" className="btn-gradient btn-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <SearchBar
          searchTerm={search}
          onSearch={setSearch}
          technologies={techOptions}
          selectedTech={activeTech}
          onSelectTech={setActiveTech}
          onClearFilter={() => { setSearch(''); setActiveTech('All') }}
        />

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
            {error}
          </div>
        )}

        <ProjectGrid projects={filtered} loading={loading} />
      </section>

      {/* ── CTA BOTTOM ───────────────────────────────────────────── */}
      {!loading && projects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl py-16 px-8 text-center space-y-6"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.08) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <div className="hero-orb-violet" style={{ top: '-80px', right: '-80px', width: 280, height: 280 }} />
          <div className="hero-orb-blue" style={{ bottom: '-80px', left: '-60px', width: 250, height: 250 }} />
          <div className="relative z-10 space-y-4">
            <div className="text-3xl">🚀</div>
            <h2 className="heading-lg" style={{ fontSize: 28 }}>Ready to showcase your work?</h2>
            <p className="body-md max-w-md mx-auto">
              Join thousands of developers building in public. Get discovered by top companies.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/register" className="btn-gradient btn-lg btn-shimmer">
                Get started free →
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

    </div>
  )
}
