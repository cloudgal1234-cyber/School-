import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

interface ScreenShellProps {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: ReactNode
  children: ReactNode
}

export function ScreenShell({ title, subtitle, onBack, right, children }: ScreenShellProps) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="flex items-center gap-3 px-4 pt-5 pb-3 sm:px-8">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="חזרה"
            className="w-11 h-11 shrink-0 rounded-2xl bg-white shadow flex items-center justify-center text-indigo-600 hover:bg-indigo-50 active:scale-90 transition-transform"
          >
            <ArrowRight size={22} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 truncate">{subtitle}</p>}
        </div>
        {right}
      </header>
      <main className="flex-1 px-4 pb-8 sm:px-8">{children}</main>
    </div>
  )
}
