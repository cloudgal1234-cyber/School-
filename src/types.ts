export type BookId = 14 | 15

export type TopicId =
  | 'fractions-b'
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
  /** Named sub-skills ("חלק א'", "חלק ב'", ...) that can be practiced individually. */
  subTopics: SubTopic[]
}

export interface SubTopic {
  /** Matches a key in generators/index.ts SUB_GENERATORS[topicId]. */
  id: string
  label: string
  description: string
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

export type Mode = 'exercises' | 'race' | 'balloons' | 'worksheet'

export interface TopicProgress {
  stars: number
  bestStreak: number
  played: number
  correct: number
}

export type ProgressState = Record<TopicId, TopicProgress>
