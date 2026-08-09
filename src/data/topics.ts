import type { Topic, TopicId } from '../types'

/**
 * Topics follow the table of contents of "שבילים פלוס" (Matach) for כיתה ה':
 * ספר 14 – שברים חלק ב', ספרות רומיות, מספרים עשרוניים חלק א'
 * ספר 15 – מספרים טבעיים חלק ב', מספרים עשרוניים חלק ב', אחוזים, ממוצע, מחקר נתונים
 */
export const TOPICS: Topic[] = [
  {
    id: 'fractions-b',
    book: 14,
    title: 'שברים – חלק ב׳',
    shortTitle: 'שברים',
    description: 'חיבור וחיסור שברים, הרחבה וצמצום, שברים מעורבים',
    emoji: '🍕',
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 'roman-numerals',
    book: 14,
    title: 'ספרות רומיות',
    shortTitle: 'ספרות רומיות',
    description: 'קריאה וכתיבה של מספרים בספרות רומיות',
    emoji: '🏛️',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'decimals-a',
    book: 14,
    title: 'מספרים עשרוניים – חלק א׳',
    shortTitle: 'עשרוניים א׳',
    description: 'עשיריות ומאיות, השוואה, חיבור וחיסור',
    emoji: '🔟',
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'natural-numbers-b',
    book: 15,
    title: 'מספרים טבעיים – חלק ב׳',
    shortTitle: 'מספרים טבעיים',
    description: 'כפל וחילוק במספרים גדולים, סדר פעולות חשבון',
    emoji: '🔢',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'decimals-b',
    book: 15,
    title: 'מספרים עשרוניים – חלק ב׳',
    shortTitle: 'עשרוניים ב׳',
    description: 'כפל וחילוק של מספרים עשרוניים',
    emoji: '🎯',
    color: 'from-cyan-400 to-sky-500',
  },
  {
    id: 'percentages',
    book: 15,
    title: 'אחוזים',
    shortTitle: 'אחוזים',
    description: 'אחוז מכמות, המרה בין שבר, עשרוני ואחוז',
    emoji: '💯',
    color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'average',
    book: 15,
    title: 'ממוצע',
    shortTitle: 'ממוצע',
    description: 'חישוב ממוצע של קבוצת מספרים',
    emoji: '⚖️',
    color: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'data-research',
    book: 15,
    title: 'מחקר נתונים',
    shortTitle: 'מחקר נתונים',
    description: 'קריאת גרפים וטבלאות, מקסימום, מינימום וטווח',
    emoji: '📊',
    color: 'from-lime-400 to-green-500',
  },
]

export const TOPIC_BY_ID: Record<TopicId, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
) as Record<TopicId, Topic>

export const BOOKS = [
  { id: 14 as const, title: 'שבילים 14', subtitle: 'שברים • ספרות רומיות • עשרוניים א׳' },
  { id: 15 as const, title: 'שבילים 15', subtitle: 'טבעיים ב׳ • עשרוניים ב׳ • אחוזים • ממוצע • נתונים' },
]
