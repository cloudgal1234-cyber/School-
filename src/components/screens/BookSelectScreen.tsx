import { BOOKS } from '../../data/topics'
import { ScreenShell } from '../common/ScreenShell'
import type { BookId } from '../../types'

export function BookSelectScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void
  onSelect: (book: BookId | 'all') => void
}) {
  return (
    <ScreenShell title="באיזה ספר תרגלו?" subtitle="בחרו ספר או תרגלו את שניהם יחד" onBack={onBack}>
      <div className="grid gap-4 max-w-md mx-auto mt-4">
        {BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelect(book.id)}
            className="rounded-3xl p-5 bg-white border-2 border-slate-200 hover:border-indigo-400 shadow-sm text-right active:scale-95 transition-all"
          >
            <p className="text-xl font-extrabold text-indigo-700">📘 {book.title}</p>
            <p className="text-sm text-slate-500 mt-1">{book.subtitle}</p>
          </button>
        ))}
        <button
          onClick={() => onSelect('all')}
          className="rounded-3xl p-5 bg-gradient-to-l from-indigo-500 to-violet-500 text-white shadow-lg text-right active:scale-95 transition-all"
        >
          <p className="text-xl font-extrabold">🌟 כל הנושאים</p>
          <p className="text-sm text-white/85 mt-1">שבילים 14 ו-15 יחד</p>
        </button>
      </div>
    </ScreenShell>
  )
}
