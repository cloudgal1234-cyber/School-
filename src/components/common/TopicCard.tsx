import type { Topic, TopicProgress } from '../../types'
import { StarRow } from './StarRow'

export function TopicCard({
  topic,
  progress,
  onClick,
}: {
  topic: Topic
  progress: TopicProgress
  onClick: () => void
}) {
  const stars = Math.min(3, Math.floor(progress.stars / 5))
  return (
    <button
      onClick={onClick}
      className={`text-right rounded-3xl p-4 bg-gradient-to-br ${topic.color} text-white shadow-lg active:scale-95 transition-transform flex flex-col gap-2 animate-pop-in`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{topic.emoji}</span>
        <StarRow count={stars} size={18} onColor />
      </div>
      <div>
        <p className="font-extrabold text-lg leading-tight">{topic.shortTitle}</p>
        <p className="text-xs text-white/85 leading-snug mt-1">{topic.description}</p>
      </div>
    </button>
  )
}
