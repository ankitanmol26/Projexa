import React from 'react'

export default function Logo({ className = "h-10 w-10", showText = true, textClass = "" }) {
  return (
    <div className="flex items-center gap-2">
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="p-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d="M 28,15 H 58 C 78,15 78,45 58,45 H 44 V 85 H 28 Z" fill="url(#p-logo-grad)" />
        <circle cx="58" cy="45" r="7" fill="#06B6D4" opacity="0.8" />
        <circle cx="58" cy="45" r="4" fill="#ffffff" />
      </svg>
      {showText && (
        <span className={`text-xl font-bold tracking-tight bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent ${textClass}`}>
          Projexa
        </span>
      )}
    </div>
  )
}
