import type { ChartData, Level, Question } from '../types'
import { buildChoicesFromLabels, buildNumericChoices, nextId, pick, randInt, shuffle } from './utils'

const DATASETS: { title: string; unit: string; labels: string[] }[] = [
  { title: 'פירות שנמכרו בקנטינה', unit: 'יחידות', labels: ['תפוח', 'בננה', 'ענבים', 'תות', 'אפרסק'] },
  { title: 'ילדים שבחרו חוג', unit: 'ילדים', labels: ['כדורסל', 'ציור', 'מחשבים', 'ריקוד', 'שחמט'] },
  { title: 'ספרים שהושאלו מהספרייה', unit: 'ספרים', labels: ['הרפתקאות', 'מדע בדיוני', 'קומיקס', 'שירה', 'היסטוריה'] },
  { title: 'מזג האוויר השבוע', unit: 'ימים', labels: ['שמש', 'עננים', 'גשם', 'רוח'] },
]

function buildChart(level: Level): { chart: ChartData; values: number[] } {
  const dataset = pick(DATASETS)
  const count = level === 1 ? 4 : dataset.labels.length
  const labels = shuffle(dataset.labels).slice(0, count)
  const values = labels.map(() => randInt(2, level === 1 ? 15 : 30))
  return { chart: { title: dataset.title, labels, values, unit: dataset.unit }, values }
}

function maxMinQuestion(level: Level): Question {
  const { chart, values } = buildChart(level)
  const askMax = Math.random() < 0.5
  const targetValue = askMax ? Math.max(...values) : Math.min(...values)
  const idx = values.indexOf(targetValue)
  const correctLabel = chart.labels[idx]
  const others = chart.labels.filter((_, i) => i !== idx)
  const { choices, correctChoiceId } = buildChoicesFromLabels(correctLabel, others)
  return {
    id: nextId('data-research'),
    topicId: 'data-research',
    level,
    prompt: `לפי הנתונים "${chart.title}", מה ${askMax ? 'הכי הרבה' : 'הכי מעט'} (${chart.unit})?`,
    inputMode: 'mcq',
    choices,
    correctChoiceId,
    correctAnswerText: correctLabel,
    chart,
  }
}

function sumOrDiffQuestion(level: Level): Question {
  const { chart, values } = buildChart(level)
  const isDiff = level >= 2 && Math.random() < 0.5
  if (isDiff) {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const diff = max - min
    const { choices, correctChoiceId } = buildNumericChoices(diff, 5)
    return {
      id: nextId('data-research'),
      topicId: 'data-research',
      level,
      prompt: `לפי הנתונים "${chart.title}", מה ההפרש בין הערך הגבוה ביותר לנמוך ביותר?`,
      inputMode: 'numeric',
      choices,
      correctChoiceId,
      correctAnswerText: String(diff),
      chart,
    }
  }
  const sum = values.reduce((s, v) => s + v, 0)
  const { choices, correctChoiceId } = buildNumericChoices(sum, 10)
  return {
    id: nextId('data-research'),
    topicId: 'data-research',
    level,
    prompt: `לפי הנתונים "${chart.title}", מה הסכום הכולל (${chart.unit})?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(sum),
    chart,
  }
}

function readValueQuestion(level: Level): Question {
  const { chart, values } = buildChart(level)
  const idx = randInt(0, chart.labels.length - 1)
  const correct = values[idx]
  const { choices, correctChoiceId } = buildNumericChoices(correct, 5)
  return {
    id: nextId('data-research'),
    topicId: 'data-research',
    level,
    prompt: `לפי הנתונים "${chart.title}", כמה ${chart.unit} שייכים ל"${chart.labels[idx]}"?`,
    inputMode: 'numeric',
    choices,
    correctChoiceId,
    correctAnswerText: String(correct),
    chart,
  }
}

export function generateDataResearch(level: Level): Question {
  if (level === 1) return pick([maxMinQuestion, readValueQuestion])(1)
  if (level === 2) return pick([maxMinQuestion, sumOrDiffQuestion, readValueQuestion])(2)
  return pick([sumOrDiffQuestion, maxMinQuestion])(3)
}
