import { useState } from 'react'
import { HomeScreen } from './components/screens/HomeScreen'
import { BookSelectScreen } from './components/screens/BookSelectScreen'
import { TopicSelectScreen } from './components/screens/TopicSelectScreen'
import { ModeSelectScreen } from './components/screens/ModeSelectScreen'
import { ResultsScreen } from './components/screens/ResultsScreen'
import { ExercisesSession } from './components/practice/ExercisesSession'
import { RaceGame } from './components/games/RaceGame'
import { BalloonGame } from './components/games/BalloonGame'
import { useProgress } from './hooks/useProgress'
import { setMuted } from './lib/sound'
import type { BookId, Level, Mode, TopicId } from './types'

type Screen = 'home' | 'book' | 'topic' | 'mode' | 'session' | 'results'

interface SessionResult {
  correct: number
  total: number
  bestStreak: number
}

function starsFor(pct: number): number {
  if (pct >= 90) return 3
  if (pct >= 70) return 2
  if (pct >= 40) return 1
  return 0
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [book, setBook] = useState<BookId | 'all'>('all')
  const [topicId, setTopicId] = useState<TopicId | null>(null)
  const [mode, setMode] = useState<Mode>('exercises')
  const [level, setLevel] = useState<Level>(1)
  const [lastResult, setLastResult] = useState<SessionResult | null>(null)
  const [muted, setMutedState] = useState(false)

  const { progress, recordSession, totalStars } = useProgress()

  function toggleMute() {
    setMutedState((m) => {
      setMuted(!m)
      return !m
    })
  }

  function handleComplete(result: SessionResult) {
    if (!topicId) return
    const pct = result.total > 0 ? (result.correct / result.total) * 100 : 0
    const starsEarned = starsFor(pct)
    recordSession(topicId, {
      correct: result.correct,
      played: result.total,
      bestStreak: result.bestStreak,
      starsEarned,
    })
    setLastResult(result)
    setScreen('results')
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {screen === 'home' && (
        <HomeScreen
          totalStars={totalStars}
          muted={muted}
          onToggleMute={toggleMute}
          onStart={() => setScreen('book')}
        />
      )}

      {screen === 'book' && (
        <BookSelectScreen
          onBack={() => setScreen('home')}
          onSelect={(b) => {
            setBook(b)
            setScreen('topic')
          }}
        />
      )}

      {screen === 'topic' && (
        <TopicSelectScreen
          book={book}
          progress={progress}
          onBack={() => setScreen('book')}
          onSelect={(id) => {
            setTopicId(id)
            setScreen('mode')
          }}
        />
      )}

      {screen === 'mode' && topicId && (
        <ModeSelectScreen
          topicId={topicId}
          onBack={() => setScreen('topic')}
          onStart={(m, l) => {
            setMode(m)
            setLevel(l)
            setScreen('session')
          }}
        />
      )}

      {screen === 'session' && topicId && mode === 'exercises' && (
        <ExercisesSession
          topicId={topicId}
          level={level}
          muted={muted}
          onBack={() => setScreen('mode')}
          onComplete={handleComplete}
        />
      )}

      {screen === 'session' && topicId && mode === 'race' && (
        <RaceGame
          topicId={topicId}
          level={level}
          muted={muted}
          onBack={() => setScreen('mode')}
          onComplete={handleComplete}
        />
      )}

      {screen === 'session' && topicId && mode === 'balloons' && (
        <BalloonGame
          topicId={topicId}
          level={level}
          muted={muted}
          onBack={() => setScreen('mode')}
          onComplete={handleComplete}
        />
      )}

      {screen === 'results' && topicId && lastResult && (
        <ResultsScreen
          topicId={topicId}
          correct={lastResult.correct}
          total={lastResult.total}
          bestStreak={lastResult.bestStreak}
          starsEarned={starsFor(lastResult.total > 0 ? (lastResult.correct / lastResult.total) * 100 : 0)}
          muted={muted}
          onPlayAgain={() => setScreen('session')}
          onChooseTopic={() => setScreen('topic')}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  )
}
