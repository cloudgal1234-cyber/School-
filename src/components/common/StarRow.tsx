import { Star } from 'lucide-react'

export function StarRow({
  count,
  max = 3,
  size = 22,
  onColor = false,
}: {
  count: number
  max?: number
  size?: number
  /** Set true when placed on a vivid/colored background (e.g. a gradient topic card). */
  onColor?: boolean
}) {
  const emptyClass = onColor ? 'fill-white/25 text-white/60' : 'fill-slate-200 text-slate-200'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < count ? 'fill-amber-400 text-amber-400' : emptyClass}
        />
      ))}
    </div>
  )
}
