import { Heart } from 'lucide-react'

export function Hearts({ lives, max }: { lives: number; max: number }) {
  return (
    <div className="flex gap-1" aria-label={`${lives} חיים מתוך ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Heart
          key={i}
          size={22}
          className={i < lives ? 'fill-rose-500 text-rose-500' : 'fill-slate-200 text-slate-200'}
        />
      ))}
    </div>
  )
}
