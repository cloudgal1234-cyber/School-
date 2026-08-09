import { useRef, useState, type PointerEvent, type ReactNode, type WheelEvent } from 'react'
import { Maximize2, Minus, Plus } from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 3.5

/** A pinch/scroll-zoomable, drag-to-pan viewer for illustrations and charts. */
export function ZoomPane({ children, height = 260 }: { children: ReactNode; height?: number }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  function clampOffset(next: { x: number; y: number }, s: number) {
    const bound = (s - 1) * 140
    return {
      x: Math.min(bound, Math.max(-bound, next.x)),
      y: Math.min(bound, Math.max(-bound, next.y)),
    }
  }

  function zoomTo(next: number) {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next))
    setScale(clamped)
    setOffset((o) => clampOffset(o, clamped))
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    zoomTo(scale - e.deltaY * 0.0025)
  }

  function handlePointerDown(e: PointerEvent) {
    if (scale <= 1) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y }
    setDragging(true)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setOffset(clampOffset({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy }, scale))
  }

  function endDrag() {
    dragRef.current = null
    setDragging(false)
  }

  function reset() {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden select-none">
      <div
        style={{ height }}
        className={`w-full flex items-center justify-center overflow-hidden ${
          scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
        }`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onDoubleClick={() => zoomTo(scale > 1 ? 1 : 2)}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {children}
        </div>
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 rounded-xl shadow p-1">
        <button
          onClick={() => zoomTo(scale - 0.5)}
          disabled={scale <= MIN_SCALE}
          aria-label="הרחקה"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-30 active:scale-90"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={reset}
          aria-label="איפוס תצוגה"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 active:scale-90"
        >
          <Maximize2 size={14} />
        </button>
        <button
          onClick={() => zoomTo(scale + 0.5)}
          disabled={scale >= MAX_SCALE}
          aria-label="הגדלה"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-30 active:scale-90"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
