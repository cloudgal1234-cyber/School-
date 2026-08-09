import { useState } from 'react'
import { TOPICS } from '../../data/topics'
import { ScreenShell } from '../common/ScreenShell'
import { TopicCard } from '../common/TopicCard'
import { PageBrowser } from './PageBrowser'
import type { BookId, ProgressState, TopicId } from '../../types'

type ViewMode = 'topic' | 'page'

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
  const [view, setView] = useState<ViewMode>('topic')
  const topics = TOPICS.filter((t) => book === 'all' || t.book === book)

  return (
    <ScreenShell
      title="בחרו איך לתרגל"
      subtitle={book === 'all' ? 'כל הנושאים משבילים 14 ו-15' : `שבילים ${book}`}
      onBack={onBack}
    >
      <div className="max-w-2xl mx-auto mt-2">
        {book !== 'all' && (
          <div className="flex gap-2 mb-4 bg-white rounded-2xl p-1 shadow-sm w-fit mx-auto">
            <button
              onClick={() => setView('topic')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                view === 'topic' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              📚 לפי נושא
            </button>
            <button
              onClick={() => setView('page')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                view === 'page' ? 'bg-indigo-600 text-white' : 'text-slate-500'
              }`}
            >
              📖 לפי עמוד
            </button>
          </div>
        )}

        {view === 'topic' || book === 'all' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                progress={progress[topic.id]}
                onClick={() => onSelect(topic.id)}
              />
            ))}
          </div>
        ) : (
          <PageBrowser book={book} progress={progress} onSelect={onSelect} />
        )}
      </div>
    </ScreenShell>
  )
}
