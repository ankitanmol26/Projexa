import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjects } from '../api/projectApi.js'
import SearchBar from '../components/project/SearchBar.jsx'
import ProjectGrid from '../components/project/ProjectGrid.jsx'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('All')
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      try {
        const data = await getProjects()
        // getAllProjects returns { projects: [...], pagination: {...} }
        const list = Array.isArray(data) ? data : Array.isArray(data?.projects) ? data.projects : []
        setProjects(list)
      } catch (err) {
        setError('Unable to load projects. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const technologyOptions = useMemo(() => {
    const tags = new Set(['All'])
    projects.forEach((project) => {
      const techs = Array.isArray(project.technologies) ? project.technologies : []
      techs.forEach((tech) => tags.add(tech))
    })
    return Array.from(tags)
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = [project.title, project.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const hasTech = selectedTech === 'All' || (Array.isArray(project.technologies) && project.technologies.includes(selectedTech))

      return matchesSearch && hasTech
    })
  }, [projects, searchTerm, selectedTech])

  return (
    <div className="space-y-16">
      {/* Hero banner */}
      <section className="glass-card relative overflow-hidden rounded-[40px] p-8 sm:p-12 md:p-16">
        <div className="absolute inset-0 bg-hero opacity-30 select-none pointer-events-none" />
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              The Project Nexus for Learners
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-violet-400">
                Where Student Projects Meet Premium Excellence.
              </h1>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Projexa is a startup-quality showcase enabling students to publish portfolios, link repositories, gather peer feedback, and catch the eye of recruiting partners worldwide.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects/create" className="primary-button px-6 py-3.5 text-base font-bold">
                Publish Project
              </Link>
              <Link to="/dashboard" className="secondary-button px-6 py-3.5 text-base">
                Your Dashboard
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-8 shadow-soft">
            <div className="space-y-5 text-slate-200">
              <div className="h-8 w-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .5-7.468A5.99 5.99 0 0 0 10.5 7v3.526a5.974 5.974 0 0 1-2.13-1A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Showcase Your Real Potential.</h2>
              <p className="text-sm leading-relaxed text-slate-400">
                Forget generic grids. Create detailed project pages that outline key technical choices, performance hurdles solved, and live product demos.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-sky-500 border border-slate-900 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="h-8 w-8 rounded-full bg-violet-500 border border-slate-900 flex items-center justify-center text-xs font-bold">J</div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-xs font-bold">M</div>
                </div>
                <span className="text-xs text-slate-400">Joined by 500+ student creators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { number: '1,000+', label: 'Student Projects', desc: 'Active published works', color: 'from-sky-500 to-sky-300' },
          { number: '500+', label: 'Developers Engaged', desc: 'Peer-to-peer learners', color: 'from-violet-500 to-violet-300' },
          { number: '150+', label: 'Technologies Used', desc: 'Frameworks, stacks & utilities', color: 'from-cyan-500 to-cyan-300' },
          { number: 'Rapid', label: 'Community Growth', desc: 'Connecting skills to industry', color: 'from-indigo-500 to-indigo-300' },
        ].map(({ number, label, desc, color }, idx) => (
          <div key={idx} className="surface-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <p className={`text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {number}
              </p>
              <p className="mt-2 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {label}
              </p>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              {desc}
            </p>
          </div>
        ))}
      </section>

      {/* Features Grid Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Platform Features</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Elevate your development profile
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Projexa is tailored for modern builders, offering clean features that turn plain source code into highly discoverable developer credentials.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Project Showcase",
              desc: "Represent academic & personal source code through detailed pages, media screenshots, and direct functional previews.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>
              )
            },
            {
              title: "GitHub Integration",
              desc: "Link your repository details directly. Allow recruiters to inspect project commits, files, and branches seamlessly.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" /></svg>
              )
            },
            {
              title: "Recruiter Discovery",
              desc: "Clean developer directories allow tech recruiters and hiring teams to browse capabilities and filter by stacks.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A3.318 3.318 0 0 1 11.682 22.5h-.364a3.318 3.318 0 0 1-3.318-3.263v-.11M14.214 16.058A3.9 3.9 0 0 0 12.3 15.3a3.9 3.9 0 0 0-1.914.758m4.214-3.038A3.9 3.9 0 0 0 12.3 12.3a3.9 3.9 0 0 0-1.914.758M12.3 12.3H12" /></svg>
              )
            },
            {
              title: "Community Feedback",
              desc: "Gain structured feedback, toggle likes, and engage with constructive peer reviews directly underneath code showcases.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.319.027-.637.049-.955.068a21.108 21.108 0 0 1-5.713-2.13l-.58-.33a2.916 2.916 0 0 0-1.04-.34h-.534a6.435 6.435 0 0 0-1.91.275l-4.5 1.583a.75.75 0 0 1-1-.707V15a6.435 6.435 0 0 0 1.91-.275l.534-.059a2.916 2.916 0 0 0 1.04-.34l.58-.33a21.108 21.108 0 0 1 5.713-2.128c.318-.019.636-.041.955-.068 1.132-.093 1.98-.962 1.98-2.097V8.511Z" /></svg>
              )
            },
            {
              title: "Portfolio Building",
              desc: "Your profile acts as a public host summarizing your bio, verified stack, and dynamic counts of repository updates.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              )
            },
            {
              title: "Internship Opportunities",
              desc: "Showcase finished, production-ready modules. Instantly match with early-stage partners seeking focused talent.",
              icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 0M12 7.5v6.75M9 7.5h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Z" /></svg>
              )
            }
          ].map(({ title, desc, icon }, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col gap-4 hover:border-sky-500/50 hover:shadow-lg transition-all duration-300">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-soft">
                {icon}
              </div>
              <div>
                <h3 className="card-title font-bold text-lg">{title}</h3>
                <p className="card-text mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Browse Section */}
      <section className="space-y-6 pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500">Explorer</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Latest Student Projects</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Search projects, filter by technologies, and browse repository entries.
          </p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          technologies={technologyOptions}
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
          onClearFilter={() => {
            setSearchTerm('')
            setSelectedTech('All')
          }}
        />
      </section>

      {error ? (
        <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/10 p-6 text-slate-100">
          <p>{error}</p>
        </div>
      ) : null}

      <ProjectGrid projects={filteredProjects} loading={loading} />
    </div>
  )
}
