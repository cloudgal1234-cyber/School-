import { Check, X } from 'lucide-react'
import type { Choice } from '../../types'

interface McqChoicesProps {
  choices: Choice[]
  selectedId: string | null
  correctChoiceId: string
  revealed: boolean
  onSelect: (id: string) => void
  disabled?: boolean
}

export function McqChoices({
  choices,
  selectedId,
  correctChoiceId,
  revealed,
  onSelect,
  disabled,
}: McqChoicesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {choices.map((choice) => {
        const isCorrect = choice.id === correctChoiceId
        const isSelected = choice.id === selectedId
        let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
        if (revealed && isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-800'
        else if (revealed && isSelected && !isCorrect) style = 'bg-rose-100 border-rose-400 text-rose-800 animate-shake'
        else if (isSelected) style = 'bg-indigo-100 border-indigo-400 text-indigo-800'

        return (
          <button
            key={choice.id}
            disabled={disabled}
            onClick={() => onSelect(choice.id)}
            className={`relative border-2 rounded-2xl px-4 py-4 text-lg font-bold transition-all active:scale-95 disabled:pointer-events-none ${style}`}
          >
            {choice.label}
            {revealed && isCorrect && (
              <Check size={18} className="absolute top-2 left-2 text-emerald-600" />
            )}
            {revealed && isSelected && !isCorrect && (
              <X size={18} className="absolute top-2 left-2 text-rose-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}
