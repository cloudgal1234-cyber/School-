import type { Choice } from '../types'

let counter = 0
export function nextId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)]
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a || 1
}

export interface Fraction {
  n: number
  d: number
}

export function reduceFraction(f: Fraction): Fraction {
  const g = gcd(f.n, f.d)
  return { n: f.n / g, d: f.d / g }
}

export function fractionLabel(f: Fraction): string {
  const r = reduceFraction(f)
  return `${r.n}/${r.d}`
}

export function fractionsEqual(a: Fraction, b: Fraction): boolean {
  return a.n * b.d === b.n * a.d
}

/** Rounds to `decimals` places and trims trailing zeros (e.g. 3.4000 -> "3.4", 340.0000 -> "340"). */
export function trimDecimal(n: number, decimals: number): string {
  if (decimals <= 0) return n.toFixed(0)
  return n
    .toFixed(decimals)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '')
}

/** Builds a 4-choice MCQ set (numeric) around a correct value, with unique plausible distractors. */
export function buildNumericChoices(
  correct: number,
  spread: number,
  opts: { allowNegative?: boolean; decimals?: number } = {},
): { choices: Choice[]; correctChoiceId: string } {
  const { allowNegative = false, decimals = 0 } = opts
  const fmt = (n: number) => trimDecimal(n, decimals)
  const values = new Set<string>([fmt(correct)])
  let guard = 0
  while (values.size < 4 && guard < 60) {
    guard += 1
    const delta = randInt(1, spread) * pick([-1, 1]) * (decimals > 0 ? 1 / 10 ** decimals : 1)
    let candidate = correct + delta
    if (!allowNegative && candidate < 0) candidate = correct + Math.abs(delta)
    values.add(fmt(candidate))
  }
  // guarantee 4 choices even if collisions kept happening
  let filler = 1
  while (values.size < 4) {
    values.add(fmt(correct + filler * (decimals > 0 ? 1 / 10 ** decimals : 1)))
    filler += 1
  }
  const shuffled = shuffle([...values])
  const choices: Choice[] = shuffled.map((label, i) => ({ id: `c${i}`, label }))
  const correctChoiceId = choices.find((c) => c.label === fmt(correct))!.id
  return { choices, correctChoiceId }
}

/** Builds a 4-choice MCQ set from arbitrary string options (already includes the correct one). */
export function buildChoicesFromLabels(correctLabel: string, distractors: string[]): {
  choices: Choice[]
  correctChoiceId: string
} {
  const labels = shuffle([correctLabel, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4))
  while (labels.length < 4) labels.push(`${correctLabel}-${labels.length}`)
  const choices: Choice[] = labels.map((label, i) => ({ id: `c${i}`, label }))
  const correctChoiceId = choices.find((c) => c.label === correctLabel)!.id
  return { choices, correctChoiceId }
}
