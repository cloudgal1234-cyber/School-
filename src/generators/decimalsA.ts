import type { Level, Question } from '../types'
import { buildChoicesFromLabels, buildNumericChoices, nextId, pick, randInt } from './utils'

function fmt1(n: number): string {
  return n.toFixed(1)
}
function fmt2(n: number): string {
  return n.toFixed(2)
}

function decimalsForLevel(level: Level): 1 | 2 {
  return level === 3 ? 2 : 1
}

/** חלק א' – השוואת מספרים עשרוניים */
export function compareDecimalsQuestion(level: Level): Question {
  const decimals = decimalsForLevel(level)
  const scale = 10 ** decimals
  const a = randInt(1, 9 * scale) / scale
  let b = randInt(1, 9 * scale) / scale
  let guard = 0
  while (Math.abs(a - b) < 1 / scale && guard < 10) {
    b = randInt(1, 9 * scale) / scale
    guard += 1
  }
  const fmt = decimals === 1 ? fmt1 : fmt2
  const correctLabel = a === b ? 'שווים' : a > b ? fmt(a) : fmt(b)
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, [fmt(a), fmt(b), 'שווים'])
  return {
    id: nextId('decimals-a'),
    topicId: 'decimals-a',
    level,
    prompt: `איזה מספר גדול יותר: ${fmt(a)} או ${fmt(b)}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

/** חלק ב' – שבר עשרוני (עשיריות / מאיות → כתיב עשרוני) */
export function fractionToDecimalQuestion(level: Level): Question {
  const isTenths = level === 1 ? true : level === 2 ? Math.random() < 0.5 : false
  if (isTenths) {
    const n = randInt(1, 9)
    const correct = n / 10
    const correctLabel = fmt1(correct)
    const { choices, correctChoiceId } = buildNumericChoices(correct, 3, { decimals: 1 })
    return {
      id: nextId('decimals-a'),
      topicId: 'decimals-a',
      level,
      prompt: `כמה זה ${n}/10 בכתיב עשרוני?`,
      inputMode: 'numeric',
      choices,
      correctChoiceId,
      correctAnswerText: correctLabel,
    }
  }
  const n = randInt(1, 99)
  const correct = n / 100
  const correctLabel = fmt2(correct)
  const { choices, correctChoiceId } = buildNumericChoices(correct, 5, { decimals: 2 })
  return {
    id: nextId('decimals-a'),
    topicId: 'decimals-a',
    level,
    prompt: `כמה זה ${n}/100 בכתיב עשרוני?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

/** חלק ג' – חיבור וחיסור מספרים עשרוניים */
export function addSubDecimalsQuestion(level: Level): Question {
  const decimals = decimalsForLevel(level)
  const scale = 10 ** decimals
  const op = pick<'+' | '-'>(['+', '-'])
  let a = randInt(1, 9 * scale) / scale
  let b = randInt(1, 9 * scale) / scale
  if (op === '-' && b > a) [a, b] = [b, a]
  const result = op === '+' ? a + b : a - b
  const fmt = decimals === 1 ? fmt1 : fmt2
  const correctLabel = fmt(Math.round(result * scale) / scale)
  const { choices, correctChoiceId } = buildNumericChoices(result, decimals === 1 ? 4 : 8, {
    decimals,
  })
  return {
    id: nextId('decimals-a'),
    topicId: 'decimals-a',
    level,
    prompt: `${fmt(a)} ${op} ${fmt(b)} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

export const DECIMALS_A_SUBTOPICS = {
  compare: compareDecimalsQuestion,
  'fraction-to-decimal': fractionToDecimalQuestion,
  'add-sub': addSubDecimalsQuestion,
}

export function generateDecimalsA(level: Level): Question {
  if (level === 1) {
    return pick([compareDecimalsQuestion, fractionToDecimalQuestion, addSubDecimalsQuestion])(level)
  }
  if (level === 2) {
    return pick([addSubDecimalsQuestion, fractionToDecimalQuestion])(level)
  }
  return pick([addSubDecimalsQuestion, compareDecimalsQuestion])(level)
}
