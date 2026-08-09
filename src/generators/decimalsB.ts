import type { Level, Question } from '../types'
import { buildNumericChoices, nextId, pick, randInt, trimDecimal } from './utils'

/** חלק א' – כפל וחילוק ב-10, 100, 1000 */
export function powerOfTenQuestion(level: Level): Question {
  const baseDecimals = pick([1, 2])
  const base = randInt(1, 9 * 10 ** baseDecimals) / 10 ** baseDecimals
  const power = level === 1 ? pick([10, 100]) : pick([10, 100, 1000])
  const zeros = Math.round(Math.log10(power))
  const op = pick<'×' | ':'>(['×', ':'])
  const result = op === '×' ? base * power : base / power
  // multiplying can only ever remove decimal places; dividing adds exactly `zeros` more.
  const resultDecimals = op === '×' ? Math.max(0, baseDecimals - zeros) : baseDecimals + zeros
  const correctAnswerText = trimDecimal(result, resultDecimals)
  const { choices, correctChoiceId } = buildNumericChoices(result, power >= 100 ? 20 : 4, {
    decimals: resultDecimals,
  })
  return {
    id: nextId('decimals-b'),
    topicId: 'decimals-b',
    level,
    prompt: `${trimDecimal(base, baseDecimals)} ${op} ${power} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText,
    explanation:
      op === '×'
        ? `כפל ב-${power} מזיז את הנקודה ${zeros} מקומות ימינה.`
        : `חילוק ב-${power} מזיז את הנקודה ${zeros} מקומות שמאלה.`,
  }
}

/** חלק ב' – כפל מספר עשרוני במספר שלם */
export function multiplyByWholeQuestion(level: Level): Question {
  const decimals = level === 2 ? 1 : 2
  const base = randInt(1, 9 * 10 ** decimals) / 10 ** decimals
  const whole = randInt(2, level === 2 ? 9 : 12)
  const result = Math.round(base * whole * 10 ** decimals) / 10 ** decimals
  const correctAnswerText = trimDecimal(result, decimals)
  const { choices, correctChoiceId } = buildNumericChoices(result, 6, { decimals })
  return {
    id: nextId('decimals-b'),
    topicId: 'decimals-b',
    level,
    prompt: `${trimDecimal(base, decimals)} × ${whole} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText,
  }
}

/** חלק ג' – חילוק מספר עשרוני במספר שלם */
export function divideByWholeQuestion(level: Level): Question {
  const whole = randInt(2, 6)
  const resultDecimals = pick([1, 2])
  const result = randInt(1, 9 * 10 ** resultDecimals) / 10 ** resultDecimals
  const base = Math.round(result * whole * 10 ** resultDecimals) / 10 ** resultDecimals
  const correctAnswerText = trimDecimal(result, resultDecimals)
  const { choices, correctChoiceId } = buildNumericChoices(result, 4, { decimals: resultDecimals })
  return {
    id: nextId('decimals-b'),
    topicId: 'decimals-b',
    level,
    prompt: `${trimDecimal(base, resultDecimals)} : ${whole} = ?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText,
  }
}

export const DECIMALS_B_SUBTOPICS = {
  'power-of-ten': powerOfTenQuestion,
  'multiply-whole': multiplyByWholeQuestion,
  'divide-whole': divideByWholeQuestion,
}

export function generateDecimalsB(level: Level): Question {
  if (level === 1) return powerOfTenQuestion(level)
  if (level === 2) return pick([multiplyByWholeQuestion, powerOfTenQuestion])(level)
  return pick([divideByWholeQuestion, multiplyByWholeQuestion])(level)
}
