import confetti from 'canvas-confetti'

export function burstConfetti(): void {
  confetti({
    particleCount: 90,
    spread: 75,
    origin: { y: 0.6 },
    colors: ['#4f46e5', '#fbbf24', '#22c55e', '#ec4899', '#38bdf8'],
  })
}

export function bigConfetti(): void {
  const end = Date.now() + 800
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#fbbf24', '#4f46e5'] })
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#22c55e', '#ec4899'] })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
