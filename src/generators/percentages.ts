import type { Level, Question } from '../types'
import { buildChoicesFromLabels, buildNumericChoices, nextId, pick, randInt } from './utils'

const NICE_PERCENTS_EASY = [10, 20, 25, 50, 75]
const NICE_PERCENTS_HARD = [5, 15, 30, 40, 60, 70, 80, 90]

function percentOfAmount(level: Level): Question {
  const percent = level === 1 ? pick(NICE_PERCENTS_EASY) : pick([...NICE_PERCENTS_EASY, ...NICE_PERCENTS_HARD])
  // choose an amount that keeps the result a whole number
  const base = percent % 25 === 0 ? 4 : percent % 20 === 0 ? 5 : percent % 10 === 0 ? 10 : 20
  const amount = base * randInt(1, level === 1 ? 10 : 20)
  const result = (amount * percent) / 100
  const { choices, correctChoiceId } = buildNumericChoices(result, level === 1 ? 5 : 10)
  return {
    id: nextId('percentages'),
    topicId: 'percentages',
    level,
    prompt: `${percent}% מתוך ${amount} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(result),
  }
}

function convertQuestion(): Question {
  const table: [number, number, string][] = [
    [1, 2, '50%'],
    [1, 4, '25%'],
    [3, 4, '75%'],
    [1, 5, '20%'],
    [2, 5, '40%'],
    [1, 10, '10%'],
    [3, 10, '30%'],
    [7, 10, '70%'],
    [1, 20, '5%'],
    [1, 100, '1%'],
  ]
  const [n, d, correctLabel] = pick(table)
  const distractors = shuffleNumbersAround(correctLabel)
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, distractors)
  return {
    id: nextId('percentages'),
    topicId: 'percentages',
    level: 2,
    prompt: `לאיזה אחוז שווה השבר ${n}/${d}?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
  }
}

function shuffleNumbersAround(label: string): string[] {
  const value = Number(label.replace('%', ''))
  const options = new Set<number>()
  let guard = 0
  while (options.size < 3 && guard < 40) {
    guard += 1
    const step = pick([1, 2, 4, 5, 10, 20])
    const candidate = value + pick([-1, 1]) * step
    const rounded = Math.max(1, Math.min(99, Math.round(candidate)))
    if (rounded !== value) options.add(rounded)
  }
  let filler = 1
  while (options.size < 3) {
    const rounded = Math.max(1, Math.min(99, value + filler))
    if (rounded !== value) options.add(rounded)
    filler += 1
  }
  return [...options].map((v) => `${v}%`)
}

function findWholeQuestion(): Question {
  const percent = pick([10, 20, 25, 50])
  const resultPart = randInt(2, 30)
  const whole = Math.round((resultPart * 100) / percent)
  const { choices, correctChoiceId } = buildNumericChoices(whole, 20)
  return {
    id: nextId('percentages'),
    topicId: 'percentages',
    level: 3,
    prompt: `${percent}% ממספר מסוים שווים ${resultPart}. מה המספר?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(whole),
  }
}

export function generatePercentages(level: Level): Question {
  if (level === 1) return percentOfAmount(1)
  if (level === 2) return pick([() => percentOfAmount(2), convertQuestion])()
  return pick([findWholeQuestion, () => percentOfAmount(3)])()
}
