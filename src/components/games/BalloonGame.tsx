import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { generateQuestion } from '../../generators'
import { TOPIC_BY_ID } from '../../data/topics'
import { playCorrect, playPop, playWrong } from '../../lib/sound'
import { burstConfetti } from '../../lib/confetti'
import { ScreenShell } from '../common/ScreenShell'
import { ChartView } from '../common/ChartView'
import { Hearts } from '../common/Hearts'
import type { Level, Question, TopicId } from '../../types'

const MAX_QUESTIONS = 15
const MAX_LIVES = 3
const BALLOON_COLORS = ['#f87171', '#60a5fa', '#4ade80', '#fbbf24']

function durationForLevel(level: Level): number {
  return level === 1 ? 11 : level === 2 ? 9 : 7
}

interface SessionResult {
  correct: number
  total: number
  bestStreak: number
}

export function BalloonGame({
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
  const duration = durationForLevel(level)
  const [asked, setAsked] = useState(0)
  const [question, setQuestion] = useState<Question>(() => generateQuestion(topicId, level))
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [escaped, setEscaped] = useState(false)
  const answeredRef = useRef(false)

  const balloonMeta = useMemo(
    () =>
      question.choices.map((choice, i) => ({
        id: choice.id,
        left: 4 + i * (66 / Math.max(1, question.choices.length - 1)) + (Math.random() * 4 - 2),
        delay: Math.random() * 1.2,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question.id],
  )

  useEffect(() => {
    answeredRef.current = false
    setEscaped(false)
    const timeout = window.setTimeout(() => {
      if (!answeredRef.current) {
        setEscaped(true)
        handleAnswer(null)
      }
    }, duration * 1000)
    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

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
      burstConfetti()
      setScore((s) => s + 15)
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
    }, 1200)
  }

  function handleBalloonClick(choiceId: string) {
    if (revealed) return
    if (!muted) playPop()
    handleAnswer(choiceId)
  }

  return (
    <ScreenShell
      title={`${topic.emoji} בלוני תשובות`}
      subtitle={`שאלה ${asked + 1} · ניקוד ${score}`}
      onBack={onBack}
      right={<Hearts lives={lives} max={MAX_LIVES} />}
    >
      <div className="max-w-md mx-auto mt-2 flex flex-col gap-4">
        <div className="bg-white rounded-3xl shadow-md p-5 text-center">
          <p className="text-xl font-extrabold text-slate-800" dir="auto">
            {question.prompt}
          </p>
          {escaped && revealed && (
            <p className="text-rose-500 text-sm font-bold mt-1">הבלון ברח! ⏰</p>
          )}
        </div>

        {question.chart && <ChartView chart={question.chart} />}

        <div className="relative h-[380px] rounded-3xl bg-gradient-to-b from-sky-200 to-sky-50 overflow-hidden border-2 border-sky-100">
          {balloonMeta.map((meta) => {
            const choice = question.choices.find((c) => c.id === meta.id)!
            const isCorrect = meta.id === question.correctChoiceId
            const isSelected = meta.id === selectedId
            return (
              <div
                key={meta.id}
                onClick={() => handleBalloonClick(meta.id)}
                className={`absolute bottom-0 flex flex-col items-center cursor-pointer select-none ${
                  revealed ? '' : 'animate-float-away'
                }`}
                style={{
                  left: `${meta.left}%`,
                  animationDelay: `${meta.delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: revealed && !isCorrect && !isSelected ? 0.35 : 1,
                }}
              >
                <div
                  className={`w-16 h-20 rounded-[50%] flex items-center justify-center text-white font-extrabold text-sm shadow-lg relative ${
                    revealed && isCorrect ? 'ring-4 ring-emerald-400' : ''
                  } ${revealed && isSelected && !isCorrect ? 'ring-4 ring-rose-400 animate-shake' : ''}`}
                  style={{ backgroundColor: meta.color }}
                >
                  {choice.label}
                  {revealed && isCorrect && (
                    <Check size={16} className="absolute -top-2 -left-2 bg-white rounded-full text-emerald-600 p-0.5" />
                  )}
                  {revealed && isSelected && !isCorrect && (
                    <X size={16} className="absolute -top-2 -left-2 bg-white rounded-full text-rose-600 p-0.5" />
                  )}
                </div>
                <div className="w-0.5 h-6 bg-slate-400" />
              </div>
            )
          })}
        </div>

        {revealed && !escaped && (
          <p className="text-sm text-slate-500 text-center">
            {selectedId === question.correctChoiceId
              ? 'כל הכבוד! 🎈'
              : `התשובה הנכונה: ${question.correctAnswerText}`}
          </p>
        )}
      </div>
    </ScreenShell>
  )
}
