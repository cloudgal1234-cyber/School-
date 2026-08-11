import type { Level, Question } from '../types'
import { buildChoicesFromLabels, buildNumericChoices, nextId, pick, randInt } from './utils'

function fmt1(n: number): string {
  return n.toFixed(1)
}
function fmt2(n: number): string {
  return n.toFixed(2)
}

/** השוואת מספרים עשרוניים (עשיריות או מאיות) */
export function compareDecimalsQuestion(decimals: 1 | 2, level: Level): Question {
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

/** שבר עשרוני (עשיריות/מאיות) → כתיב עשרוני */
export function fractionToDecimalQuestion(decimals: 1 | 2, level: Level): Question {
  if (decimals === 1) {
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

/** זיהוי הספרה במקום העשיריות/המאיות */
export function placeValueQuestion(decimals: 1 | 2, level: Level): Question {
  const whole = randInt(1, 9)
  const tenths = randInt(0, 9)
  const hundredths = randInt(0, 9)
  const label = decimals === 1 ? `${whole}.${tenths}` : `${whole}.${tenths}${hundredths}`
  const correctDigit = decimals === 1 ? tenths : hundredths
  const placeName = decimals === 1 ? 'העשיריות' : 'המאיות'
  const wrongDigits = new Set<number>()
  let guard = 0
  while (wrongDigits.size < 3 && guard < 20) {
    const d = randInt(0, 9)
    if (d !== correctDigit) wrongDigits.add(d)
    guard += 1
  }
  const { choices, correctChoiceId } = buildChoicesFromLabels(
    String(correctDigit),
    [...wrongDigits].map(String),
  )
  return {
    id: nextId('decimals-a'),
    topicId: 'decimals-a',
    level,
    prompt: `במספר ${label}, מה הספרה במקום ${placeName}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: String(correctDigit),
  }
}

/** חיבור וחיסור מספרים עשרוניים (עשיריות/מאיות) */
export function addSubDecimalsQuestion(decimals: 1 | 2, level: Level): Question {
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

/** עמ' 129–151: עשיריות – הכרה */
export function tenthsIntroQuestion(level: Level): Question {
  return pick([
    () => fractionToDecimalQuestion(1, level),
    () => compareDecimalsQuestion(1, level),
    () => placeValueQuestion(1, level),
  ])()
}

/** עמ' 151–163: עשיריות – חיבור וחיסור */
export function tenthsAddSubQuestion(level: Level): Question {
  return addSubDecimalsQuestion(1, level)
}

/** עמ' 163–186: מאיות – הכרה */
export function hundredthsIntroQuestion(level: Level): Question {
  return pick([
    () => fractionToDecimalQuestion(2, level),
    () => compareDecimalsQuestion(2, level),
    () => placeValueQuestion(2, level),
  ])()
}

/** עמ' 186–196: מאיות – חיבור וחיסור */
export function hundredthsAddSubQuestion(level: Level): Question {
  return addSubDecimalsQuestion(2, level)
}

const REVIEW_POOL = [tenthsIntroQuestion, tenthsAddSubQuestion, hundredthsIntroQuestion, hundredthsAddSubQuestion]

/** עמ' 196–216: חזרה כללית */
export function reviewQuestion(level: Level): Question {
  return pick(REVIEW_POOL)(level)
}

export const DECIMALS_A_SUBTOPICS = {
  'tenths-intro': tenthsIntroQuestion,
  'tenths-add-sub': tenthsAddSubQuestion,
  'hundredths-intro': hundredthsIntroQuestion,
  'hundredths-add-sub': hundredthsAddSubQuestion,
  review: reviewQuestion,
}

export function generateDecimalsA(level: Level): Question {
  return pick(REVIEW_POOL)(level)
}
