import type { Level, Question } from '../types'
import {
  buildChoicesFromLabels,
  fractionLabel,
  lcm,
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

/** עמ' 4–8: שברים שווים – זיהוי אם שני שברים שווים */
export function equivalentQuestion(level: Level): Question {
  const d = pick([2, 3, 4, 5, 6])
  const n = randInt(1, d - 1)
  const k = randInt(2, level === 1 ? 4 : level === 2 ? 6 : 8)
  const isEqual = Math.random() < 0.5
  const otherN = isEqual ? n * k : n * k + pick([-1, 1])
  const otherD = d * k
  const correctLabel = isEqual ? 'כן' : 'לא'
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, ['כן', 'לא'])
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level,
    prompt: `האם ${n}/${d} שווה ל-${otherN}/${otherD}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
    explanation: `${n}/${d} = ${(n / d).toFixed(3)}, ${otherN}/${otherD} = ${(otherN / otherD).toFixed(3)}`,
  }
}

/** עמ' 8–28: הרחבה – הרחבת שבר למכנה גדול יותר */
export function expandQuestion(level: Level): Question {
  const d = pick([2, 3, 4, 5, 6])
  const n = randInt(1, d - 1)
  const k = randInt(2, level === 1 ? 4 : level === 2 ? 6 : 9)
  const targetD = d * k
  const newN = n * k
  const { choices, correctChoiceId } = buildChoicesFromLabels(String(newN), [
    String(newN + 1),
    String(Math.max(1, newN - 1)),
    String(n + k),
  ])
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level,
    prompt: `הרחיבו את השבר ${n}/${d} למכנה ${targetD}: ${n}/${d} = ?/${targetD}`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(newN),
    explanation: `${d} × ${k} = ${targetD}, אז גם המונה כפול ${k}: ${n} × ${k} = ${newN}`,
  }
}

/** עמ' 28–37: צמצום – צמצום שבר לשבר פשוט ביותר */
export function reduceQuestion(level: Level): Question {
  const targetD = pick([2, 3, 4, 5, 6])
  const targetN = randInt(1, targetD - 1)
  const k = randInt(2, level === 1 ? 4 : level === 2 ? 6 : 9)
  const n = targetN * k
  const d = targetD * k
  const correctLabel = fractionLabel({ n, d })
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, [
    `${targetN + 1}/${targetD}`,
    `${n}/${d}`,
    `${targetN}/${targetD + 1}`,
  ])
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level,
    prompt: `צמצמו את השבר ${n}/${d} לשבר הפשוט ביותר`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
    explanation: `מחלקים מונה ומכנה ב-${k}: ${n}:${k} = ${targetN}, ${d}:${k} = ${targetD}`,
  }
}

/** עמ' 37–55: הרחבה וצמצום (תרגול משולב) */
export function expandOrReduceQuestion(level: Level): Question {
  return pick([expandQuestion, reduceQuestion])(level)
}

const HARDER_DENOMINATOR_PAIRS: [number, number][] = [
  [4, 6],
  [4, 10],
  [6, 8],
  [6, 9],
  [6, 10],
  [8, 10],
  [9, 12],
]

/** עמ' 55–73: מכנה משותף – מציאת המכנה המשותף הקטן ביותר */
export function commonDenominatorQuestion(level: Level): Question {
  const [a, b] = level === 3 ? pick(HARDER_DENOMINATOR_PAIRS) : pick(RELATED_PAIRS)
  const result = lcm(a, b)
  const { choices, correctChoiceId } = buildChoicesFromLabels(String(result), [
    String(a * b),
    String(result + a),
    String(Math.max(a, b)),
  ])
  return {
    id: nextId('fractions-b'),
    topicId: 'fractions-b',
    level,
    prompt: `מהו המכנה המשותף הקטן ביותר של השברים עם המכנים ${a} ו-${b}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: String(result),
  }
}

/** עמ' 73–100: חיבור וחיסור שברים עם מכנים שונים */
export function addSubUnlikeQuestion(level: Level): Question {
  const op = pick<'+' | '-'>(['+', '-'])
  const [small, big] = pick(RELATED_PAIRS)
  const factor = big / small
  const aSmallDenom = randInt(1, small - 1)
  const a: Fraction = { n: aSmallDenom, d: small }
  const bBigDenom = randInt(1, big - 1)
  const b: Fraction = { n: bBigDenom, d: big }
  const aScaled: Fraction = { n: aSmallDenom * factor, d: big }
  let result: Fraction
  let prompt: string
  if (op === '-' && aScaled.n < b.n) {
    result = { n: b.n - aScaled.n, d: big }
    prompt = `${fractionLabel(b)} - ${fractionLabel(a)}`
  } else {
    result = op === '+' ? { n: aScaled.n + b.n, d: big } : { n: aScaled.n - b.n, d: big }
    prompt = `${fractionLabel(a)} ${op} ${fractionLabel(b)}`
  }
  const correctLabel = fractionLabel(result)
  const wrongs = [
    fractionLabel({ n: result.n + 1, d: result.d }),
    fractionLabel({ n: Math.max(1, result.n - 1), d: result.d }),
    fractionLabel({ n: result.n, d: result.d + pick([2, -2]) }),
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

const REVIEW_POOL = [
  equivalentQuestion,
  expandQuestion,
  reduceQuestion,
  commonDenominatorQuestion,
  addSubUnlikeQuestion,
]

/** עמ' 100–126: חזרה – תרגול מגוון על כל מה שנלמד בפרק */
export function reviewQuestion(level: Level): Question {
  return pick(REVIEW_POOL)(level)
}

export const FRACTIONS_B_SUBTOPICS = {
  equivalent: equivalentQuestion,
  expand: expandQuestion,
  reduce: reduceQuestion,
  'expand-reduce': expandOrReduceQuestion,
  'common-denominator': commonDenominatorQuestion,
  'add-sub-unlike': addSubUnlikeQuestion,
  review: reviewQuestion,
}

export function generateFractionsB(level: Level): Question {
  return pick(REVIEW_POOL)(level)
}
