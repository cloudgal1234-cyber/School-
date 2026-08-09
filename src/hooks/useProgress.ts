import { useCallback, useEffect, useState } from 'react'
import { TOPICS } from '../data/topics'
import type { ProgressState, TopicId, TopicProgress } from '../types'

const STORAGE_KEY = 'shvilim-practice-progress-v1'

function emptyTopicProgress(): TopicProgress {
  return { stars: 0, bestStreak: 0, played: 0, correct: 0 }
}

function defaultState(): ProgressState {
  const state = {} as ProgressState
  for (const topic of TOPICS) state[topic.id] = emptyTopicProgress()
  return state
}

function load(): ProgressState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    const state = defaultState()
    for (const topic of TOPICS) {
      if (parsed[topic.id]) state[topic.id] = { ...emptyTopicProgress(), ...parsed[topic.id] }
    }
    return state
  } catch {
    return defaultState()
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => load())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // storage unavailable (e.g. private mode) – ignore
    }
  }, [progress])

  const recordSession = useCallback(
    (topicId: TopicId, opts: { correct: number; played: number; bestStreak: number; starsEarned: number }) => {
      setProgress((prev) => {
        const current = prev[topicId] ?? emptyTopicProgress()
        return {
          ...prev,
          [topicId]: {
            stars: current.stars + opts.starsEarned,
            bestStreak: Math.max(current.bestStreak, opts.bestStreak),
            played: current.played + opts.played,
            correct: current.correct + opts.correct,
          },
        }
      })
    },
    [],
  )

  const totalStars = Object.values(progress).reduce((sum, t) => sum + t.stars, 0)

  const resetProgress = useCallback(() => setProgress(defaultState()), [])

  return { progress, recordSession, totalStars, resetProgress }
}
