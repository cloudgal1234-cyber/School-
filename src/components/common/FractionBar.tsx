/** An original illustrative fraction bar (not from any textbook): a rectangle split into `d` equal parts, `n` shaded. */
export function FractionBar({ n, d, color = '#f472b6' }: { n: number; d: number; color?: string }) {
  const safeD = Math.min(Math.max(d, 1), 16)
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="flex w-full max-w-xs h-16 rounded-xl overflow-hidden border-2 border-slate-300">
        {Array.from({ length: safeD }, (_, i) => (
          <div
            key={i}
            className="flex-1 border-l last:border-l-0 border-slate-300"
            style={{ backgroundColor: i < n ? color : 'white' }}
          />
        ))}
      </div>
      <p className="text-sm font-bold text-slate-500" dir="ltr">
        {n}/{d}
      </p>
    </div>
  )
}
