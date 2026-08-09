import { useMemo, useState } from 'react'
import { generateQuestion } from '../../generators'
import { TOPIC_BY_ID } from '../../data/topics'
import { checkNumericAnswer } from '../../lib/answerCheck'
import { playCorrect, playWrong } from '../../lib/sound'
import { ScreenShell } from '../common/ScreenShell'
import { Button } from '../common/Button'
import { ZoomPane } from '../common/ZoomPane'
import { ChartView } from '../common/ChartView'
import { FractionBar } from '../common/FractionBar'
import { PercentGrid } from '../common/PercentGrid'
import { WorksheetItem } from './WorksheetItem'
import type { Level, Question, TopicId } from '../../types'

const ITEMS_PER_EXERCISE = 3
const LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳']

interface SessionResult {
  correct: number
  total: number
  bestStreak: number
}

interface Exercise {
  subTopicId: string
  subTopicLabel: string
  subTopicDescription: string
  items: Question[]
}

function buildExercises(topicId: TopicId, level: Level): Exercise[] {
  const topic = TOPIC_BY_ID[topicId]
  return topic.subTopics.map((sub) => ({
    subTopicId: sub.id,
    subTopicLabel: sub.label,
    subTopicDescription: sub.description,
    items: Array.from({ length: ITEMS_PER_EXERCISE }, () => generateQuestion(topicId, level, sub.id)),
  }))
}

/** An original illustration (never a scan of the real book) that fits the question, if any. */
function illustrationFor(question: Question) {
  if (question.chart) return <ChartView chart={question.chart} />
  const percentMatch = question.prompt.match(/(\d+)%/)
  if (percentMatch) return <PercentGrid percent={Number(percentMatch[1])} />
  const fractionMatch = question.correctAnswerText.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) return <FractionBar n={Number(fractionMatch[1])} d={Number(fractionMatch[2])} />
  return null
}

export function WorksheetPage({
  topicId,
  level,
  muted,
  onBack,
  onComplete,
}: {
  topicId: TopicId
  level: Level
  muted: boolean
  onBack: () => void
  onComplete: (result: SessionResult) => void
}) {
  const topic = TOPIC_BY_ID[topicId]
  const [round, setRound] = useState(0)
  const exercises = useMemo(
    () => buildExercises(topicId, level),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topicId, level, round],
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const allItems = useMemo(() => exercises.flatMap((ex) => ex.items), [exercises])
  const answeredCount = allItems.filter((q) => (answers[q.id] ?? '').trim() !== '').length

  function isItemCorrect(q: Question): boolean {
    const value = answers[q.id]
    if (value === undefined) return false
    return q.inputMode === 'numeric' ? checkNumericAnswer(value, q.correctAnswerText) : value === q.correctChoiceId
  }

  function handleCheck() {
    setChecked(true)
    let correct = 0
    let streak = 0
    let bestStreak = 0
    for (const q of allItems) {
      if (isItemCorrect(q)) {
        correct += 1
        streak += 1
        bestStreak = Math.max(bestStreak, streak)
      } else {
        streak = 0
      }
    }
    if (!muted) {
      if (correct === allItems.length) playCorrect()
      else if (correct === 0) playWrong()
    }
    window.setTimeout(() => onComplete({ correct, total: allItems.length, bestStreak }), 900)
  }

  function newSheet() {
    setAnswers({})
    setChecked(false)
    setRound((r) => r + 1)
  }

  return (
    <ScreenShell
      title={`${topic.emoji} ${topic.shortTitle} · דף עבודה`}
      subtitle={`שבילים ${topic.book} · עמ׳ ${topic.pageRange[0]}–${topic.pageRange[1]}`}
      onBack={onBack}
    >
      <div className="max-w-xl mx-auto mt-2 flex flex-col gap-4 pb-24">
        {exercises.map((ex, exIndex) => {
          const illustration = illustrationFor(ex.items[0])
          return (
            <div key={ex.subTopicId} className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-3">
              <div>
                <p className="font-extrabold text-slate-800">
                  תרגיל {exIndex + 1} · {ex.subTopicLabel}
                </p>
                <p className="text-xs text-slate-400">{ex.subTopicDescription}</p>
              </div>

              {illustration && <ZoomPane height={200}>{illustration}</ZoomPane>}

              <div className="flex flex-col gap-2">
                {ex.items.map((q, i) => (
                  <WorksheetItem
                    key={q.id}
                    question={q}
                    letter={LETTERS[i] ?? String(i + 1)}
                    value={answers[q.id] ?? null}
                    onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                    checked={checked}
                    isCorrect={isItemCorrect(q)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {checked && (
          <Button variant="secondary" onClick={newSheet} className="w-full">
            📝 דף עבודה חדש
          </Button>
        )}
      </div>

      {!checked && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500">
            מולאו {answeredCount} מתוך {allItems.length}
          </p>
          <Button onClick={handleCheck} disabled={answeredCount === 0} className="w-full max-w-md">
            בדיקת הדף ✓
          </Button>
        </div>
      )}
    </ScreenShell>
  )
}
