/** An original illustrative 10x10 percent grid (not from any textbook): shades `percent` of 100 squares. */
export function PercentGrid({ percent, color = '#a78bfa' }: { percent: number; color?: string }) {
  const shaded = Math.min(100, Math.max(0, Math.round(percent)))
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="grid grid-cols-10 gap-[2px] w-full max-w-[220px] aspect-square">
        {Array.from({ length: 100 }, (_, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{ backgroundColor: i < shaded ? color : '#e2e8f0' }}
          />
        ))}
      </div>
      <p className="text-sm font-bold text-slate-500">{shaded}%</p>
    </div>
  )
}
