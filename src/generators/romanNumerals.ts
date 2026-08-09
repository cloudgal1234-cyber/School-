import type { Level, Question } from '../types'
import { buildChoicesFromLabels, nextId, pick, randInt } from './utils'

const VALUES: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

export function toRoman(num: number): string {
  let n = num
  let out = ''
  for (const [value, symbol] of VALUES) {
    while (n >= value) {
      out += symbol
      n -= value
    }
  }
  return out
}

function randomDifferentRoman(correct: number, max: number): string {
  let candidate = correct
  let guard = 0
  while ((candidate === correct || candidate < 1) && guard < 20) {
    candidate = correct + randInt(-6, 6)
    guard += 1
  }
  candidate = Math.min(Math.max(candidate, 1), max)
  return toRoman(candidate)
}

function maxForLevel(level: Level): number {
  return level === 1 ? 20 : level === 2 ? 50 : 100
}

/** חלק א' – ממספר לספרות רומיות */
export function toRomanQuestion(level: Level): Question {
  const max = maxForLevel(level)
  const value = randInt(1, max)
  const correctLabel = toRoman(value)
  const distractors = new Set<string>()
  let guard = 0
  while (distractors.size < 3 && guard < 30) {
    distractors.add(randomDifferentRoman(value, max))
    guard += 1
  }
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, [...distractors])
  return {
    id: nextId('roman'),
    topicId: 'roman-numerals',
    level,
    prompt: `איך כותבים ${value} בספרות רומיות?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

/** חלק ב' – מספרות רומיות למספר */
export function toArabicQuestion(level: Level): Question {
  const max = maxForLevel(level)
  const value = randInt(1, max)
  const roman = toRoman(value)
  const correctLabel = String(value)
  const distractors = new Set<number>()
  let guard = 0
  while (distractors.size < 3 && guard < 30) {
    const d = value + randInt(-6, 6)
    if (d > 0 && d !== value) distractors.add(d)
    guard += 1
  }
  const { choices, correctChoiceId } = buildChoicesFromLabels(
    correctLabel,
    [...distractors].map(String),
  )
  return {
    id: nextId('roman'),
    topicId: 'roman-numerals',
    level,
    prompt: `לאיזה מספר שווה ${roman}?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

export const ROMAN_NUMERALS_SUBTOPICS = {
  'to-roman': toRomanQuestion,
  'to-arabic': toArabicQuestion,
}

export function generateRomanNumerals(level: Level): Question {
  return pick([toRomanQuestion, toArabicQuestion])(level)
}
