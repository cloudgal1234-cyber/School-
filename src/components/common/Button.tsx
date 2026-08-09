import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95',
  secondary:
    'bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 active:scale-95',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95',
  danger: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-400 active:scale-95',
}

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-7 py-4 text-lg rounded-3xl',
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-bold transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  )
}
