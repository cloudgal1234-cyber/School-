import { useEffect, useRef, useState } from 'react'
import { generateQuestion } from '../../generators'
import { TOPIC_BY_ID } from '../../data/topics'
import { playCorrect, playTick, playWrong } from '../../lib/sound'
import { ScreenShell } from '../common/ScreenShell'
import { McqChoices } from '../common/McqChoices'
import { ChartView } from '../common/ChartView'
import { Hearts } from '../common/Hearts'
import type { Level, Question, TopicId } from '../../types'

const MAX_QUESTIONS = 20
const MAX_LIVES = 3

function timeForLevel(level: Level): number {
  return level === 1 ? 15 : level === 2 ? 12 : 9
}

interface SessionResult {
  correct: number
  total: number
  bestStreak: number
}

export function RaceGame({
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
  const totalTime = timeForLevel(level)
  const [asked, setAsked] = useState(0)
  const [question, setQuestion] = useState<Question>(() => generateQuestion(topicId, level))
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const answeredRef = useRef(false)

  useEffect(() => {
    answeredRef.current = false
    setTimeLeft(totalTime)
    const tickInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (answeredRef.current) return t
        if (t <= 1) {
          if (!muted) playTick()
          return 0
        }
        if (t <= 4 && !muted) playTick()
        return t - 0.1
      })
    }, 100)
    return () => clearInterval(tickInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  useEffect(() => {
    if (timeLeft <= 0 && !answeredRef.current) {
      handleAnswer(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  function endGame(finalCorrect: number, finalAsked: number, finalBestStreak: number) {
    onComplete({ correct: finalCorrect, total: finalAsked, bestStreak: finalBestStreak })
  }

  function handleAnswer(choiceId: string | null) {
    if (answeredRef.current) return
    answeredRef.current = true
    const correct = choiceId !== null && choiceId === question.correctChoiceId
    setSelectedId(choiceId)
    setRevealed(true)

    const nextAsked = asked + 1
    let nextCorrect = correctCount
    let nextBestStreak = bestStreak
    let nextLives = lives

    if (correct) {
      if (!muted) playCorrect()
      const speedBonus = Math.max(0, Math.round(timeLeft))
      setScore((s) => s + 10 + speedBonus)
      nextCorrect += 1
      setCorrectCount(nextCorrect)
      const nextStreak = streak + 1
      setStreak(nextStreak)
      if (nextStreak > bestStreak) {
        nextBestStreak = nextStreak
        setBestStreak(nextStreak)
      }
    } else {
      if (!muted) playWrong()
      setStreak(0)
      nextLives = lives - 1
      setLives(nextLives)
    }

    setAsked(nextAsked)

    window.setTimeout(() => {
      if (nextLives <= 0 || nextAsked >= MAX_QUESTIONS) {
        endGame(nextCorrect, nextAsked, nextBestStreak)
        return
      }
      setQuestion(generateQuestion(topicId, level))
      setSelectedId(null)
      setRevealed(false)
    }, 1100)
  }

  const timerPct = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100))

  return (
    <ScreenShell
      title={`${topic.emoji} מרוץ מהירות`}
      subtitle={`שאלה ${asked + 1} · ניקוד ${score}`}
      onBack={onBack}
      right={<Hearts lives={lives} max={MAX_LIVES} />}
    >
      <div className="max-w-md mx-auto mt-2 flex flex-col gap-5">
        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full transition-[width] duration-100 linear ${timerPct < 25 ? 'bg-rose-500' : 'bg-indigo-500'}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 text-center">
          <p className="text-2xl font-extrabold text-slate-800" dir="auto">
            {question.prompt}
          </p>
        </div>

        {question.chart && <ChartView chart={question.chart} />}

        <McqChoices
          choices={question.choices}
          selectedId={selectedId}
          correctChoiceId={question.correctChoiceId}
          revealed={revealed}
          onSelect={handleAnswer}
          disabled={revealed}
        />
      </div>
    </ScreenShell>
  )
}
