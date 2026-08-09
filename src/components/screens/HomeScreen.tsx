import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '../common/Button'

export function HomeScreen({
  totalStars,
  muted,
  onToggleMute,
  onStart,
}: {
  totalStars: number
  muted: boolean
  onToggleMute: () => void
  onStart: () => void
}) {
  return (
    <div className="relative min-h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-8">
      <button
        onClick={onToggleMute}
        aria-label={muted ? 'הפעלת קול' : 'השתקת קול'}
        className="absolute top-5 left-5 w-11 h-11 rounded-2xl bg-white shadow flex items-center justify-center text-slate-500"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div className="animate-bob text-7xl">🧮</div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800">שבילים בכיף</h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">
          תרגול חשבון לפי ספרי שבילים 14 ו-15 · לפי נושא, במשחקים ובתרגילים
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-md">
        <span className="text-2xl">⭐</span>
        <span className="text-xl font-extrabold text-amber-500">{totalStars}</span>
        <span className="text-slate-500">כוכבים שנאספו</span>
      </div>

      <Button size="lg" onClick={onStart} className="w-full max-w-xs">
        🚀 בואו נתחיל!
      </Button>
    </div>
  )
}
