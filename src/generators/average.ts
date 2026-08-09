import type { Level, Question } from '../types'
import { buildNumericChoices, nextId, randInt } from './utils'

function makeNumbersWithWholeAverage(count: number, min: number, max: number): number[] {
  let guard = 0
  while (guard < 200) {
    guard += 1
    const nums = Array.from({ length: count }, () => randInt(min, max))
    const sum = nums.reduce((s, n) => s + n, 0)
    if (sum % count === 0) return nums
  }
  // fallback: force it
  const nums = Array.from({ length: count - 1 }, () => randInt(min, max))
  const partial = nums.reduce((s, n) => s + n, 0)
  const last = partial % count === 0 ? min : count - (partial % count) + min
  return [...nums, last]
}

/** חלק א' – חישוב ממוצע */
export function averageQuestion(level: Level): Question {
  const count = level === 1 ? 3 : level === 2 ? 4 : 5
  const [min, max] = level === 1 ? [2, 20] : level === 2 ? [5, 40] : [10, 80]
  const nums = makeNumbersWithWholeAverage(count, min, max)
  const sum = nums.reduce((s, n) => s + n, 0)
  const avg = sum / count
  const { choices, correctChoiceId } = buildNumericChoices(avg, level === 1 ? 4 : 8)
  return {
    id: nextId('average'),
    topicId: 'average',
    level,
    prompt: `מה הממוצע של המספרים: ${nums.join(', ')}?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(avg),
    explanation: `סכום: ${nums.join(' + ')} = ${sum}. ${sum} : ${count} = ${avg}`,
  }
}

/** חלק ב' – השלמת מספר חסר לפי ממוצע נתון */
export function missingNumberQuestion(level: Level): Question {
  const count = 4
  const avg = level === 1 ? randInt(5, 15) : level === 2 ? randInt(10, 25) : randInt(15, 40)
  const total = avg * count
  const known = Array.from({ length: count - 1 }, () => randInt(2, Math.max(3, total / count + 15)))
  const knownSum = known.reduce((s, n) => s + n, 0)
  let missing = total - knownSum
  let finalKnown = known
  if (missing < 1) {
    // regenerate with smaller known numbers so the missing one stays positive
    finalKnown = known.map((n) => Math.max(1, Math.floor(n / 2)))
    const fixedSum = finalKnown.reduce((s, n) => s + n, 0)
    missing = total - fixedSum
  }
  const finalSum = finalKnown.reduce((s, n) => s + n, 0)
  const { choices, correctChoiceId } = buildNumericChoices(missing, 8)
  return {
    id: nextId('average'),
    topicId: 'average',
    level,
    prompt: `הממוצע של ${count} מספרים הוא ${avg}. שלושה מהם הם ${finalKnown.join(', ')}. מהו המספר הרביעי?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(missing),
    explanation: `הסכום הכולל הוא ${avg} × ${count} = ${total}. ${total} - ${finalSum} = ${missing}`,
  }
}

export const AVERAGE_SUBTOPICS = {
  average: averageQuestion,
  'missing-number': missingNumberQuestion,
}

export function generateAverage(level: Level): Question {
  if (level === 3 && Math.random() < 0.5) return missingNumberQuestion(level)
  return averageQuestion(level)
}
