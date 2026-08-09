import type { Level, Question } from '../types'
import { buildChoicesFromLabels, buildNumericChoices, nextId, pick, randInt } from './utils'

/** חלק א' – כפל */
export function multiplicationQuestion(level: Level): Question {
  const a = level === 1 ? randInt(11, 99) : randInt(12, 45)
  const b = level === 1 ? randInt(2, 9) : randInt(11, 25)
  const result = a * b
  const { choices, correctChoiceId } = buildNumericChoices(result, level === 1 ? 12 : 40)
  return {
    id: nextId('natural-b'),
    topicId: 'natural-numbers-b',
    level,
    prompt: `${a} × ${b} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(result),
  }
}

/** חלק ב' – חילוק (עם ובלי שארית) */
export function divisionQuestion(level: Level): Question {
  const divisor = randInt(2, level === 1 ? 9 : 12)
  const quotient = randInt(4, level === 1 ? 15 : 30)
  const remainder = level === 1 ? 0 : randInt(0, divisor - 1)
  const dividend = divisor * quotient + remainder
  const correctLabel = remainder === 0 ? String(quotient) : `${quotient} שארית ${remainder}`
  const wrongs = [
    remainder === 0 ? String(quotient + 1) : `${quotient + 1} שארית ${remainder}`,
    remainder === 0 ? String(Math.max(1, quotient - 1)) : `${Math.max(1, quotient - 1)} שארית ${remainder}`,
    remainder === 0 ? String(quotient) + '.5' : `${quotient} שארית ${(remainder + 1) % divisor}`,
  ]
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, wrongs)
  return {
    id: nextId('natural-b'),
    topicId: 'natural-numbers-b',
    level,
    prompt: remainder === 0 ? `${dividend} : ${divisor} = ?` : `${dividend} : ${divisor} = ? (כתבו מנה ושארית)`,
    inputMode: remainder === 0 ? 'numeric' : 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

/** חלק ג' – סדר פעולות חשבון */
export function orderOfOperationsQuestion(level: Level): Question {
  const a = randInt(2, 12)
  const b = randInt(2, 12)
  const c = randInt(2, 9)
  const useParens = Math.random() < 0.5
  let prompt: string
  let result: number
  if (useParens) {
    prompt = `(${a} + ${b}) × ${c}`
    result = (a + b) * c
  } else {
    prompt = `${a} + ${b} × ${c}`
    result = a + b * c
  }
  const { choices, correctChoiceId } = buildNumericChoices(result, 15)
  return {
    id: nextId('natural-b'),
    topicId: 'natural-numbers-b',
    level,
    prompt: `${prompt} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(result),
    explanation: 'זכרו: קודם כפל וחילוק, ואז חיבור וחיסור. סוגריים תמיד ראשונים.',
  }
}

/** חלק ד' – חוקי התחלקות */
export function divisibilityQuestion(level: Level): Question {
  const divisor = pick([2, 3, 5, 10])
  const isDivisible = Math.random() < 0.5
  let number = randInt(20, 199)
  if (isDivisible) {
    number = number - (number % divisor)
    if (number === 0) number = divisor
  } else if (number % divisor === 0) {
    number += 1
  }
  const correctLabel = number % divisor === 0 ? 'כן' : 'לא'
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, ['כן', 'לא'])
  return {
    id: nextId('natural-b'),
    topicId: 'natural-numbers-b',
    level,
    prompt: `האם המספר ${number} מתחלק ב-${divisor} ללא שארית?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

export const NATURAL_NUMBERS_B_SUBTOPICS = {
  multiplication: multiplicationQuestion,
  division: divisionQuestion,
  'order-of-operations': orderOfOperationsQuestion,
  divisibility: divisibilityQuestion,
}

export function generateNaturalNumbersB(level: Level): Question {
  if (level === 1) return pick([multiplicationQuestion, divisionQuestion])(1)
  if (level === 2) return pick([multiplicationQuestion, divisionQuestion])(2)
  return pick([orderOfOperationsQuestion, divisibilityQuestion, divisionQuestion])(3)
}
