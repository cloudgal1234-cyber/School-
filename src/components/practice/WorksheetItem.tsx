import { Check, X } from 'lucide-react'
import type { Question } from '../../types'

export function WorksheetItem({
  question,
  letter,
  value,
  onChange,
  checked,
  isCorrect,
}: {
  question: Question
  letter: string
  value: string | null
  onChange: (value: string) => void
  checked: boolean
  isCorrect: boolean
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-3 transition-colors ${
        !checked
          ? 'border-slate-200 bg-white'
          : isCorrect
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-rose-300 bg-rose-50'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">
          {letter}
        </span>
        <p className="flex-1 min-w-[120px] font-bold text-slate-800" dir="auto">
          {question.prompt}
        </p>

        {question.inputMode === 'numeric' ? (
          <input
            type="text"
            inputMode="decimal"
            dir="ltr"
            disabled={checked}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="?"
            className="w-24 text-center text-lg font-extrabold py-1.5 rounded-xl border-2 border-slate-300 outline-none focus:border-indigo-400 disabled:opacity-80"
          />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {question.choices.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={checked}
                onClick={() => onChange(c.id)}
                className={`px-3 py-1.5 rounded-xl border-2 text-sm font-bold transition-colors disabled:pointer-events-none ${
                  value === c.id
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {checked && (isCorrect ? <Check size={20} className="text-emerald-600 shrink-0" /> : <X size={20} className="text-rose-600 shrink-0" />)}
      </div>

      {checked && !isCorrect && (
        <p className="text-xs text-slate-500 mt-2 pr-9">
          התשובה הנכונה: <span className="font-bold text-slate-700">{question.correctAnswerText}</span>
          {question.explanation && <> · {question.explanation}</>}
        </p>
      )}
    </div>
  )
}
