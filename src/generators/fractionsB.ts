import type { Level, Question } from '../types'
import {
  buildChoicesFromLabels,
  fractionLabel,
  fractionsEqual,
  nextId,
  pick,
  randInt,
  type Fraction,
} from './utils'

const RELATED_PAIRS: [number, number][] = [
  [2, 4],
  [2, 6],
  [2, 8],
  [3, 6],
  [3, 9],
  [3, 12],
  [4, 8],
  [4, 12],
  [5, 10],
  [6, 12],
]

function addSub(denom: number, op: '+' | '-'): { a: Fraction; b: Fraction; result: Fraction; prompt: string } {
  let n1 = randInt(1, denom - 1)
  let n2 = randInt(1, denom - 1)
  if (op === '-' && n2 > n1) [n1, n2] = [n2, n1]
  const a: Fraction = { n: n1, d: denom }
  const b: Fraction = { n: n2, d: denom }
  const result: Fraction = op === '+' ? { n: n1 + n2, d: denom } : { n: n1 - n2, d: denom }
  return { a, b, result, prompt: `${fractionLabel(a)} ${op} ${fractionLabel(b)}` }
}

function addSubRelated(op: '+' | '-'): { a: Fraction; b: Fraction; result: Fraction; prompt: string } {
  const [small, big] = pick(RELATED_PAIRS)
  const factor = big / small
  const aSmallDenom = randInt(1, small - 1)
  const a: Fraction = { n: aSmallDenom, d: small }
  const bBigDenom = randInt(1, big - 1)
  const b: Fraction = { n: bBigDenom, d: big }
  const aScaled: Fraction = { n: aSmallDenom * factor, d: big }
  let result: Fraction
  if (op === '-' && aScaled.n < b.n) {
    result = { n: b.n - aScaled.n, d: big }
    return { a: b, b: a, result, prompt: `${fractionLabel(b)} - ${fractionLabel(a)}` }
  }
  result = op === '+' ? { n: aScaled.n + b.n, d: big } : { n: aScaled.n - b.n, d: big }
  return { a, b, result, prompt: `${fractionLabel(a)} ${op} ${fractionLabel(b)}` }
}

function compareQuestion(): Question {
  const [small, big] = pick(RELATED_PAIRS)
  const useMixedDenoms = Math.random() < 0.5
  const dA = useMixedDenoms ? small : pick([3, 4, 5, 6, 8])
  const dB = useMixedDenoms ? big : pick([3, 4, 5, 6, 8].filter((d) => d !== dA))
  const a: Fraction = { n: randInt(1, dA - 1), d: dA }
  const b: Fraction = { n: randInt(1, dB - 1), d: dB }
  const va = a.n / a.d
  const vb = b.n / b.d
  let correctLabel: string
  if (Math.abs(va - vb) < 1e-9) {
    correctLabel = 'שווים'
  } else {
    correctLabel = va > vb ? fractionLabel(a) : fractionLabel(b)
  }
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, [
    fractionLabel(a),
    fractionLabel(b),
    'שווים',
  ])
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level: 3,
    prompt: `איזה שבר גדול יותר: ${fractionLabel(a)} או ${fractionLabel(b)}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
    explanation: `${fractionLabel(a)} = ${va.toFixed(2)}, ${fractionLabel(b)} = ${vb.toFixed(2)}`,
  }
}

function mixedNumberQuestion(): Question {
  const whole = randInt(1, 4)
  const d = pick([2, 3, 4, 5, 6, 8])
  const n = randInt(1, d - 1)
  const improperN = whole * d + n
  const correctLabel = `${improperN}/${d}`
  const distractors = [
    `${improperN + 1}/${d}`,
    `${whole * d + n + d}/${d}`,
    `${(whole + 1) * d + n}/${d}`,
  ]
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, distractors)
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level: 3,
    prompt: `הפכו למספר מעורב לשבר פשוט: ${whole} שלמים ו-${fractionLabel({ n, d })}`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
    explanation: `${whole} × ${d} + ${n} = ${improperN}, אז התוצאה היא ${correctLabel}`,
  }
}

export function generateFractionsB(level: Level): Question {
  if (level === 1) {
    const denom = pick([4, 5, 6, 8, 10])
    const op = pick<'+' | '-'>(['+', '-'])
    const { result, prompt } = addSub(denom, op)
    const correctLabel = fractionLabel(result)
    const wrongs = [
      fractionLabel({ n: result.n + 1, d: denom }),
      fractionLabel({ n: Math.max(1, result.n - 1), d: denom }),
      fractionLabel({ n: result.n, d: denom + pick([2, -2]) }),
    ]
    const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, wrongs)
    return {
      id: nextId('fractions-b'),
      topicId: 'fractions-b',
      level,
      prompt: `${prompt} = ?`,
      inputMode: 'mcq',
      choices,
      correctChoiceId,
      correctAnswerText: correctLabel,
      explanation: `מכנה משותף ${denom}, אז מחברים/מחסרים רק את המונים.`,
    }
  }

  if (level === 2) {
    const op = pick<'+' | '-'>(['+', '-'])
    const { a, b, result, prompt } = addSubRelated(op)
    const correctLabel = fractionLabel(result)
    const wrongs = [
      fractionLabel({ n: result.n + 1, d: result.d }),
      fractionLabel({ n: Math.max(1, result.n - 1), d: result.d }),
      fractionLabel({ n: a.n + (fractionsEqual(a, b) ? 1 : b.n), d: b.d }),
    ]
    const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, wrongs)
    return {
      id: nextId('fractions-b'),
      topicId: 'fractions-b',
      level,
      prompt: `${prompt} = ?`,
      inputMode: 'mcq',
      choices,
      correctChoiceId,
      correctAnswerText: correctLabel,
      explanation: `הרחיבו למכנה משותף, ואז ${op === '+' ? 'חיברו' : 'חיסרו'} את המונים.`,
    }
  }

  return pick([compareQuestion, mixedNumberQuestion])()
}
