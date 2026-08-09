export type BookId = 14 | 15

export type TopicId =
  | 'fractions-b'
  | 'roman-numerals'
  | 'decimals-a'
  | 'natural-numbers-b'
  | 'decimals-b'
  | 'percentages'
  | 'average'
  | 'data-research'

export type Level = 1 | 2 | 3

export interface Topic {
  id: TopicId
  book: BookId
  title: string
  shortTitle: string
  description: string
  emoji: string
  color: string // tailwind gradient "from-x to-y"
  /** Approximate page range of this unit within its book, for page-based browsing. */
  pageRange: [number, number]
}

export interface Choice {
  id: string
  label: string
}

export interface ChartData {
  title: string
  labels: string[]
  values: number[]
  unit?: string
}

/** A single generated practice question. */
export interface Question {
  id: string
  topicId: TopicId
  level: Level
  prompt: string
  /** Preferred way to answer in free-practice ("תרגילים") mode. */
  inputMode: 'numeric' | 'mcq'
  choices: Choice[]
  correctChoiceId: string
  /** Human readable correct answer, also used to validate numeric typed input. */
  correctAnswerText: string
  explanation?: string
  chart?: ChartData
}

export type QuestionGenerator = (level: Level) => Question

export type Mode = 'exercises' | 'race' | 'balloons'

export interface TopicProgress {
  stars: number
  bestStreak: number
  played: number
  correct: number
}

export type ProgressState = Record<TopicId, TopicProgress>
