import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from './Button'

interface NumericAnswerInputProps {
  onSubmit: (value: string) => void
  revealed: boolean
  isCorrect: boolean
  disabled?: boolean
}

export function NumericAnswerInput({ onSubmit, revealed, isCorrect, disabled }: NumericAnswerInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!revealed) {
      setValue('')
      inputRef.current?.focus()
    }
  }, [revealed])

  const submit = () => {
    if (value.trim() === '' || disabled) return
    onSubmit(value.trim())
  }

  let borderStyle = 'border-slate-300 focus:border-indigo-400'
  if (revealed) borderStyle = isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-rose-400 bg-rose-50 animate-shake'

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="relative w-full max-w-xs">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          dir="ltr"
          value={value}
          disabled={revealed || disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="?"
          className={`w-full text-center text-3xl font-extrabold py-4 rounded-2xl border-4 outline-none transition-colors ${borderStyle}`}
        />
        {revealed && (
          <span className="absolute -top-3 -left-3 rounded-full bg-white shadow p-1">
            {isCorrect ? (
              <Check size={22} className="text-emerald-600" />
            ) : (
              <X size={22} className="text-rose-600" />
            )}
          </span>
        )}
      </div>
      {!revealed && (
        <Button onClick={submit} disabled={value.trim() === '' || disabled} className="w-full max-w-xs">
          בדיקה
        </Button>
      )}
    </div>
  )
}
