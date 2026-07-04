/** Projexa logo — PX mark with upward arrow, matching brand image */
export default function Logo({ size = 28, showText = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#22D3EE" />
            <stop offset="50%"  stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="lg-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Partial circle ring */}
        <circle cx="18" cy="24" r="13" stroke="url(#lg-a)" strokeWidth="2"
          strokeDasharray="55 28" strokeLinecap="round" fill="none" opacity="0.7" />

        {/* P — vertical stem */}
        <rect x="8" y="15" width="3.2" height="14.5" rx="1.6" fill="url(#lg-a)" />
        {/* P — bowl */}
        <path d="M11.2 15H17.5C20.5 15 23 17.2 23 20S20.5 25 17.5 25H11.2"
          stroke="url(#lg-a)" strokeWidth="3.2" strokeLinecap="round" fill="none" />

        {/* X */}
        <line x1="24" y1="25" x2="31" y2="32" stroke="url(#lg-a)" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="24" y1="32" x2="31" y2="25" stroke="url(#lg-a)" strokeWidth="2.8" strokeLinecap="round" />

        {/* Arrow shaft */}
        <line x1="29" y1="19" x2="37" y2="7"  stroke="url(#lg-b)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Arrow head */}
        <polyline points="29,7 37,7 37,15"
          stroke="url(#lg-b)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: size * 0.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Projexa
        </span>
      )}
    </div>
  )
}
