import type { ChartData } from '../../types'

const BAR_COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ec4899', '#0ea5e9']

export function ChartView({ chart }: { chart: ChartData }) {
  const max = Math.max(...chart.values, 1)
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-bold text-slate-600 mb-3">{chart.title}</p>
      <div className="flex items-end gap-3 h-36">
        {chart.labels.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
            <span className="text-xs font-bold text-slate-700">{chart.values[i]}</span>
            <div
              className="w-full rounded-t-lg transition-all"
              style={{
                height: `${(chart.values[i] / max) * 100}%`,
                minHeight: 6,
                backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
            <span className="text-[11px] text-slate-500 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
