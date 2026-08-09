import { useEffect } from 'react'
import { TOPIC_BY_ID } from '../../data/topics'
import { Button } from '../common/Button'
import { StarRow } from '../common/StarRow'
import { bigConfetti } from '../../lib/confetti'
import { playFanfare } from '../../lib/sound'
import type { TopicId } from '../../types'

export function ResultsScreen({
  topicId,
  correct,
  total,
  bestStreak,
  starsEarned,
  muted,
  onPlayAgain,
  onChooseTopic,
  onHome,
}: {
  topicId: TopicId
  correct: number
  total: number
  bestStreak: number
  starsEarned: number
  muted: boolean
  onPlayAgain: () => void
  onChooseTopic: () => void
  onHome: () => void
}) {
  const topic = TOPIC_BY_ID[topicId]
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  useEffect(() => {
    if (starsEarned >= 2) {
      bigConfetti()
      if (!muted) playFanfare()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const message =
    pct >= 90
      ? 'מדהים! את/ה אלוף/ת שבילים! 🏆'
      : pct >= 70
        ? 'כל הכבוד, עבודה מצוינת! 🎉'
        : pct >= 40
          ? 'התחלה טובה, בואו נתרגל עוד קצת 💪'
          : 'לא נורא, תרגול עושה מושלם! נסו שוב 🌟'

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
      <div className="text-6xl animate-pop-in">{topic.emoji}</div>
      <h2 className="text-2xl font-extrabold text-slate-800">{message}</h2>

      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center gap-3">
        <StarRow count={starsEarned} size={36} />
        <p className="text-4xl font-extrabold text-indigo-600">
          {correct}/{total}
        </p>
        <p className="text-slate-500">{pct}% תשובות נכונות</p>
        {bestStreak >= 3 && (
          <p className="text-amber-500 font-bold text-sm">🔥 רצף מקסימלי: {bestStreak} ברציפות</p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={onPlayAgain}>🔁 עוד סבב באותו נושא</Button>
        <Button variant="secondary" onClick={onChooseTopic}>
          📚 נושא אחר
        </Button>
        <Button variant="ghost" onClick={onHome}>
          🏠 מסך הבית
        </Button>
      </div>
    </div>
  )
}
