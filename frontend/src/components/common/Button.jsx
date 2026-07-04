import { motion } from 'framer-motion'
import Loader from './Loader.jsx'

const VARIANTS = {
  primary:   'btn-primary',
  gradient:  'btn-gradient',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const SIZES = {
  sm:      'btn-sm',
  md:      'btn-md',
  lg:      'btn-lg',
  xl:      'btn-xl',
  default: 'btn',
}

export default function Button({
  variant  = 'primary',
  size     = 'default',
  loading  = false,
  className = '',
  children,
  type     = 'button',
  disabled,
  ...rest
}) {
  const cls = `${SIZES[size] ?? 'btn'} ${VARIANTS[variant] ?? 'btn-primary'} ${className}`.trim()
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      className={cls}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      {...rest}
    >
      {loading && <Loader size={14} className="shrink-0" />}
      {children}
    </motion.button>
  )
}
