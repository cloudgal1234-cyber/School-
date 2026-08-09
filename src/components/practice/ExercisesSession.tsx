import { useMemo, useState } from 'react'
import { generateQuestion } from '../../generators'
import { TOPIC_BY_ID } from '../../data/topics'
import { checkNumericAnswer } from '../../lib/answerCheck'
import { playCorrect, playWrong } from '../../lib/sound'
import { ScreenShell } from '../common/ScreenShell'
import { McqChoices } from '../common/McqChoices'
import { NumericAnswerInput } from '../common/NumericAnswerInput'
import { ChartView } from '../common/ChartView'
import { Button } from '../common/Button'
import type { Level, Question, TopicId } from '../../types'

const SESSION_LENGTH = 10

interface SessionResult {
  correct: number
  total: number
  bestStreak: number
}

export function ExercisesSession({
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
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<Question>(() => generateQuestion(topicId, level))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const progressPct = useMemo(() => Math.round((index / SESSION_LENGTH) * 100), [index])

  function finishAnswer(correct: boolean, choiceId: string | null) {
    setSelectedId(choiceId)
    setRevealed(true)
    setIsCorrect(correct)
    if (correct) {
      if (!muted) playCorrect()
      setCorrectCount((c) => c + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      if (!muted) playWrong()
      setStreak(0)
    }
  }

  function handleMcqSelect(choiceId: string) {
    if (revealed) return
    finishAnswer(choiceId === question.correctChoiceId, choiceId)
  }

  function handleNumericSubmit(value: string) {
    if (revealed) return
    finishAnswer(checkNumericAnswer(value, question.correctAnswerText), null)
  }

  function next() {
    const nextIndex = index + 1
    if (nextIndex >= SESSION_LENGTH) {
      onComplete({ correct: correctCount, total: SESSION_LENGTH, bestStreak })
      return
    }
    setIndex(nextIndex)
    setQuestion(generateQuestion(topicId, level))
    setSelectedId(null)
    setRevealed(false)
  }

  return (
    <ScreenShell
      title={`${topic.emoji} ${topic.shortTitle}`}
      subtitle={`שאלה ${index + 1} מתוך ${SESSION_LENGTH}`}
      onBack={onBack}
    >
      <div className="max-w-md mx-auto mt-2 flex flex-col gap-5">
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 text-center">
          <p className="text-2xl font-extrabold text-slate-800" dir="auto">
            {question.prompt}
          </p>
        </div>

        {question.chart && <ChartView chart={question.chart} />}

        {question.inputMode === 'numeric' ? (
          <NumericAnswerInput onSubmit={handleNumericSubmit} revealed={revealed} isCorrect={isCorrect} />
        ) : (
          <McqChoices
            choices={question.choices}
            selectedId={selectedId}
            correctChoiceId={question.correctChoiceId}
            revealed={revealed}
            onSelect={handleMcqSelect}
          />
        )}

        {revealed && (
          <div className="flex flex-col gap-3 animate-pop-in">
            {!isCorrect && (
              <p className="text-sm text-slate-500 text-center">
                התשובה הנכונה: <span className="font-bold text-slate-700">{question.correctAnswerText}</span>
                {question.explanation && <> · {question.explanation}</>}
              </p>
            )}
            <Button onClick={next} className="w-full">
              {index + 1 >= SESSION_LENGTH ? 'לסיום 🏁' : 'לשאלה הבאה ←'}
            </Button>
          </div>
        )}
      </div>
    </ScreenShell>
  )
}
