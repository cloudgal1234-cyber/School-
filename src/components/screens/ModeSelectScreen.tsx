import { useState } from 'react'
import { Gauge, ListChecks, NotebookPen, Wind } from 'lucide-react'
import { TOPIC_BY_ID } from '../../data/topics'
import { ScreenShell } from '../common/ScreenShell'
import type { Level, Mode, TopicId } from '../../types'

const MODES: { id: Mode; title: string; description: string; icon: typeof ListChecks }[] = [
  {
    id: 'worksheet',
    title: 'דף עבודה',
    description: 'כל הסעיפים (חלק א׳, ב׳, ג׳...) בדף אחד, עם מקום לכתוב תשובה ליד כל שאלה',
    icon: NotebookPen,
  },
  {
    id: 'exercises',
    title: 'תרגילים',
    description: 'תרגול רגוע, שאלה אחר שאלה, בלי לחץ זמן',
    icon: ListChecks,
  },
  {
    id: 'race',
    title: 'מרוץ מהירות',
    description: 'עונים מהר לפני שנגמר הזמן, עם 3 חיים',
    icon: Gauge,
  },
  {
    id: 'balloons',
    title: 'בלוני תשובות',
    description: 'לוכדים את הבלון עם התשובה הנכונה לפני שהוא בורח',
    icon: Wind,
  },
]

const LEVELS: { id: Level; label: string; emoji: string }[] = [
  { id: 1, label: 'קל', emoji: '🌱' },
  { id: 2, label: 'בינוני', emoji: '🔥' },
  { id: 3, label: 'מאתגר', emoji: '🚀' },
]

export function ModeSelectScreen({
  topicId,
  onBack,
  onStart,
}: {
  topicId: TopicId
  onBack: () => void
  onStart: (mode: Mode, level: Level) => void
}) {
  const topic = TOPIC_BY_ID[topicId]
  const [level, setLevel] = useState<Level>(1)

  return (
    <ScreenShell
      title={`${topic.emoji} ${topic.shortTitle}`}
      subtitle={`${topic.title} · שבילים ${topic.book} · עמ׳ ${topic.pageRange[0]}–${topic.pageRange[1]}`}
      onBack={onBack}
    >
      <div className="max-w-md mx-auto mt-4">
        <p className="font-bold text-slate-600 mb-2">רמת קושי</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`rounded-2xl py-3 font-bold border-2 transition-all active:scale-95 ${
                level === l.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <div className="text-xl">{l.emoji}</div>
              {l.label}
            </button>
          ))}
        </div>

        <p className="font-bold text-slate-600 mb-2">איך רוצים לתרגל?</p>
        <div className="flex flex-col gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => onStart(m.id, level)}
              className="flex items-center gap-4 rounded-2xl p-4 bg-white border-2 border-slate-200 hover:border-indigo-400 text-right active:scale-95 transition-all"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <m.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-800">{m.title}</p>
                <p className="text-xs text-slate-500">{m.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScreenShell>
  )
}
