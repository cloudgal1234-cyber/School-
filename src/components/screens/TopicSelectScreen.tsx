import { TOPICS } from '../../data/topics'
import { ScreenShell } from '../common/ScreenShell'
import { TopicCard } from '../common/TopicCard'
import type { BookId, ProgressState, TopicId } from '../../types'

export function TopicSelectScreen({
  book,
  progress,
  onBack,
  onSelect,
}: {
  book: BookId | 'all'
  progress: ProgressState
  onBack: () => void
  onSelect: (topicId: TopicId) => void
}) {
  const topics = TOPICS.filter((t) => book === 'all' || t.book === book)
  return (
    <ScreenShell
      title="בחרו נושא לתרגול"
      subtitle={book === 'all' ? 'כל הנושאים משבילים 14 ו-15' : `שבילים ${book}`}
      onBack={onBack}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-2">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            progress={progress[topic.id]}
            onClick={() => onSelect(topic.id)}
          />
        ))}
      </div>
    </ScreenShell>
  )
}
