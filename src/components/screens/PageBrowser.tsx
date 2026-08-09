import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { BOOKS, pageBoundsForBook, topicForPage, topicsForBook } from '../../data/topics'
import { Button } from '../common/Button'
import { StarRow } from '../common/StarRow'
import type { BookId, ProgressState, TopicId } from '../../types'

export function PageBrowser({
  initialBook,
  initialPage,
  progress,
  onSelect,
}: {
  initialBook: BookId
  initialPage?: number
  progress: ProgressState
  onSelect: (topicId: TopicId) => void
}) {
  const [book, setBook] = useState<BookId>(initialBook)
  const [minPage, maxPage] = pageBoundsForBook(book)
  // pageText is the free-typing buffer shown in the input; it's only clamped into a
  // valid page number on blur/Enter, so typing e.g. "180" doesn't snap back to the
  // minimum after every keystroke.
  const [pageText, setPageText] = useState(String(initialPage ?? minPage))
  const parsedPage = Number(pageText)
  const page = Number.isFinite(parsedPage) && pageText.trim() !== '' ? parsedPage : minPage
  const topics = useMemo(() => topicsForBook(book), [book])
  const currentTopic = topicForPage(book, page)

  function commit(value: number, forBook: BookId = book) {
    const [lo, hi] = pageBoundsForBook(forBook)
    const clamped = Math.min(Math.max(value, lo), hi)
    setPageText(String(clamped))
    return clamped
  }

  function switchBook(next: BookId) {
    if (next === book) return
    setBook(next)
    commit(pageBoundsForBook(next)[0], next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-center">
        {BOOKS.map((b) => (
          <button
            key={b.id}
            onClick={() => switchBook(b.id)}
            className={`px-4 py-1.5 rounded-xl font-bold text-sm border-2 transition-colors ${
              book === b.id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-md p-5 flex flex-col items-center gap-3">
        <p className="font-bold text-slate-600">איזה עמוד פותחים היום?</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => commit(page - 1)}
            disabled={page <= minPage}
            aria-label="עמוד קודם"
            className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
          >
            <Minus size={20} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            value={pageText}
            onChange={(e) => {
              // allow free typing (including a momentarily-empty or out-of-range value);
              // only digits pass through, clamping happens on blur/Enter.
              const raw = e.target.value
              if (raw === '' || /^\d+$/.test(raw)) setPageText(raw)
            }}
            onBlur={() => commit(page)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commit(page)
                e.currentTarget.blur()
              }
            }}
            className="w-24 text-center text-3xl font-extrabold py-2 rounded-2xl border-2 border-slate-200 outline-none focus:border-indigo-400"
          />
          <button
            onClick={() => commit(page + 1)}
            disabled={page >= maxPage}
            aria-label="עמוד הבא"
            className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-400">עמודים {minPage}–{maxPage} בשבילים {book}</p>

        <div
          className={`w-full rounded-2xl p-4 mt-1 bg-gradient-to-br ${currentTopic.color} text-white flex items-center gap-3 animate-pop-in`}
          key={currentTopic.id}
        >
          <span className="text-3xl">{currentTopic.emoji}</span>
          <div className="flex-1">
            <p className="font-extrabold">{currentTopic.title}</p>
            <p className="text-xs text-white/85">
              עמ׳ {currentTopic.pageRange[0]}–{currentTopic.pageRange[1]}
            </p>
          </div>
        </div>

        <Button onClick={() => onSelect(currentTopic.id)} className="w-full">
          תרגלו את הנושא של עמוד {page} ←
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-4">
        <p className="font-bold text-slate-600 mb-2 px-1">תוכן העניינים · שבילים {book}</p>
        <div className="flex flex-col gap-1.5">
          {topics.map((topic) => {
            const stars = Math.min(3, Math.floor(progress[topic.id].stars / 5))
            const isCurrent = topic.id === currentTopic.id
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setPageText(String(topic.pageRange[0]))
                  onSelect(topic.id)
                }}
                className={`flex items-center gap-3 rounded-2xl p-3 text-right transition-colors active:scale-95 ${
                  isCurrent ? 'bg-indigo-50 ring-2 ring-indigo-300' : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-xl w-7 text-center shrink-0">{topic.emoji}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-slate-800 truncate">{topic.title}</span>
                  <span className="block text-xs text-slate-400">
                    עמ׳ {topic.pageRange[0]}–{topic.pageRange[1]}
                  </span>
                </span>
                <StarRow count={stars} size={14} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
