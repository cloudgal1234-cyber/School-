/** Normalizes and compares a typed numeric answer against the expected answer text. */
export function checkNumericAnswer(input: string, correctAnswerText: string): boolean {
  const normalize = (s: string) => s.trim().replace(',', '.').replace(/^\+/, '')
  const a = Number(normalize(input))
  const b = Number(normalize(correctAnswerText))
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return normalize(input) === normalize(correctAnswerText)
  }
  return Math.abs(a - b) < 1e-6
}
