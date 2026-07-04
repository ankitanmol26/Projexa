import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const ToastContext = createContext(null)

const STYLES = {
  success: { color: '#4ADE80', border: 'rgba(34,197,94,0.25)' },
  error:   { color: '#F87171', border: 'rgba(239,68,68,0.25)' },
  info:    { color: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
  warning: { color: '#FCD34D', border: 'rgba(245,158,11,0.25)' },
}

const ICONS = {
  success: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
  error:   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  info:    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />,
  warning: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
}

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const show = useCallback((message, type = 'info', ms = 4000) => {
    const id = ++_id
    setToasts((p) => [...p.slice(-4), { id, message, type }])
    timers.current[id] = setTimeout(() => dismiss(id), ms)
    return id
  }, [dismiss])

  const value = {
    toast:   show,
    success: (m, ms) => show(m, 'success', ms),
    error:   (m, ms) => show(m, 'error',   ms),
    info:    (m, ms) => show(m, 'info',    ms),
    warning: (m, ms) => show(m, 'warning', ms),
    dismiss,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast portal */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ width: 320 }}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const s = STYLES[t.type] || STYLES.info
            return (
              <motion.div
                key={t.id}
                layout
                role="alert"
                className="flex items-start gap-3 rounded-xl px-4 py-3.5 pointer-events-auto"
                style={{
                  background: 'rgba(20,20,24,0.95)',
                  border: `1px solid ${s.border}`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                }}
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke={s.color} strokeWidth="2.5" viewBox="0 0 24 24">
                  {ICONS[t.type]}
                </svg>
                <span className="flex-1 leading-relaxed text-sm" style={{ color: '#FAFAFA', fontWeight: 400 }}>
                  {t.message}
                </span>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss"
                  style={{ color: '#71717A' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
