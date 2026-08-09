let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setMuted(value: boolean): void {
  muted = value
}

export function isMuted(): boolean {
  return muted
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', gain = 0.15): void {
  const c = getCtx()
  if (!c || muted) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  osc.connect(g)
  g.connect(c.destination)
  const t0 = c.currentTime + start
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function playCorrect(): void {
  tone(523.25, 0, 0.12, 'triangle')
  tone(659.25, 0.1, 0.12, 'triangle')
  tone(783.99, 0.2, 0.18, 'triangle')
}

export function playWrong(): void {
  tone(180, 0, 0.22, 'sawtooth', 0.1)
}

export function playPop(): void {
  tone(880, 0, 0.08, 'square', 0.08)
}

export function playFanfare(): void {
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.2, 'triangle'))
}

export function playTick(): void {
  tone(440, 0, 0.05, 'square', 0.05)
}
