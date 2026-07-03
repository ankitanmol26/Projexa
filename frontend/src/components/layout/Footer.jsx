import React from 'react'
import Logo from '../common/Logo.jsx'

export default function Footer() {
  return (
    <footer
      className="border-t py-12 text-sm"
      style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" showText={true} textClass="text-sm font-semibold" />
          <span className="text-xs">&middot; Nexus of Student Innovation &amp; Excellence</span>
        </div>
        <p className="text-xs">Built with React, Vite, Tailwind &amp; Express. &copy; {new Date().getFullYear()} Projexa.</p>
      </div>
    </footer>
  )
}
