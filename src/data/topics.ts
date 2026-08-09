import type { BookId, SubTopic, Topic, TopicId } from '../types'

/**
 * Topics follow the table of contents of "שבילים פלוס" (Matach) for כיתה ה':
 * ספר 14 – שברים חלק ב', ספרות רומיות, מספרים עשרוניים חלק א'
 * ספר 15 – מספרים טבעיים חלק ב', מספרים עשרוניים חלק ב', אחוזים, ממוצע, מחקר נתונים
 *
 * pageRange מחלק כל ספר (1–216 עמודים) ליחידות לפי סדר הנושאים בתוכן
 * העניינים, כדי לאפשר ניווט "לפי עמוד" על פני הספר כולו. מכיוון שאין לי
 * תוכן עניינים מדויק ועמוד-מדויק של הספר הפיזי, שמונת הנושאים שזוהו נמתחים
 * באופן יחסי על פני כל 216 העמודים (לא הועתקו מעותק מודפס). subTopics
 * מפרקים כל נושא לתת-נושאים ("חלק א'", "חלק ב'"...) שתואמים למחוללי
 * השאלות ב-src/generators.
 */

const FRACTIONS_B_SUBTOPICS: SubTopic[] = [
  { id: 'same-denominator', label: 'חלק א׳', description: 'חיבור וחיסור עם מכנה משותף' },
  { id: 'related-denominator', label: 'חלק ב׳', description: 'חיבור וחיסור עם הרחבה למכנה משותף' },
  { id: 'compare', label: 'חלק ג׳', description: 'השוואת שברים' },
  { id: 'mixed-numbers', label: 'חלק ד׳', description: 'שברים מעורבים ושברים פשוטים' },
]

const ROMAN_NUMERALS_SUBTOPICS: SubTopic[] = [
  { id: 'to-roman', label: 'חלק א׳', description: 'ממספר לספרות רומיות' },
  { id: 'to-arabic', label: 'חלק ב׳', description: 'מספרות רומיות למספר' },
]

const DECIMALS_A_SUBTOPICS: SubTopic[] = [
  { id: 'compare', label: 'חלק א׳', description: 'השוואת מספרים עשרוניים' },
  { id: 'fraction-to-decimal', label: 'חלק ב׳', description: 'שבר עשרוני' },
  { id: 'add-sub', label: 'חלק ג׳', description: 'חיבור וחיסור מספרים עשרוניים' },
]

const NATURAL_NUMBERS_B_SUBTOPICS: SubTopic[] = [
  { id: 'multiplication', label: 'חלק א׳', description: 'כפל' },
  { id: 'division', label: 'חלק ב׳', description: 'חילוק' },
  { id: 'order-of-operations', label: 'חלק ג׳', description: 'סדר פעולות חשבון' },
  { id: 'divisibility', label: 'חלק ד׳', description: 'חוקי התחלקות' },
]

const DECIMALS_B_SUBTOPICS: SubTopic[] = [
  { id: 'power-of-ten', label: 'חלק א׳', description: 'כפל וחילוק ב-10, 100, 1000' },
  { id: 'multiply-whole', label: 'חלק ב׳', description: 'כפל במספר שלם' },
  { id: 'divide-whole', label: 'חלק ג׳', description: 'חילוק במספר שלם' },
]

const PERCENTAGES_SUBTOPICS: SubTopic[] = [
  { id: 'percent-of-amount', label: 'חלק א׳', description: 'אחוז מכמות' },
  { id: 'convert', label: 'חלק ב׳', description: 'המרה בין שבר לאחוז' },
  { id: 'find-whole', label: 'חלק ג׳', description: 'מציאת השלם לפי אחוז' },
]

const AVERAGE_SUBTOPICS: SubTopic[] = [
  { id: 'average', label: 'חלק א׳', description: 'חישוב ממוצע' },
  { id: 'missing-number', label: 'חלק ב׳', description: 'השלמת מספר חסר לפי ממוצע' },
]

const DATA_RESEARCH_SUBTOPICS: SubTopic[] = [
  { id: 'max-min', label: 'חלק א׳', description: 'מקסימום ומינימום' },
  { id: 'sum-diff', label: 'חלק ב׳', description: 'סכום והפרש' },
  { id: 'read-value', label: 'חלק ג׳', description: 'קריאת ערך מהגרף' },
]

export const TOPICS: Topic[] = [
  {
    id: 'fractions-b',
    book: 14,
    title: 'שברים – חלק ב׳',
    shortTitle: 'שברים',
    description: 'חיבור וחיסור שברים, הרחבה וצמצום, שברים מעורבים',
    emoji: '🍕',
    color: 'from-rose-400 to-pink-500',
    pageRange: [4, 95],
    subTopics: FRACTIONS_B_SUBTOPICS,
  },
  {
    id: 'roman-numerals',
    book: 14,
    title: 'ספרות רומיות',
    shortTitle: 'ספרות רומיות',
    description: 'קריאה וכתיבה של מספרים בספרות רומיות',
    emoji: '🏛️',
    color: 'from-amber-400 to-orange-500',
    pageRange: [96, 130],
    subTopics: ROMAN_NUMERALS_SUBTOPICS,
  },
  {
    id: 'decimals-a',
    book: 14,
    title: 'מספרים עשרוניים – חלק א׳',
    shortTitle: 'עשרוניים א׳',
    description: 'עשיריות ומאיות, השוואה, חיבור וחיסור',
    emoji: '🔟',
    color: 'from-sky-400 to-blue-500',
    pageRange: [131, 216],
    subTopics: DECIMALS_A_SUBTOPICS,
  },
  {
    id: 'natural-numbers-b',
    book: 15,
    title: 'מספרים טבעיים – חלק ב׳',
    shortTitle: 'מספרים טבעיים',
    description: 'כפל וחילוק במספרים גדולים, סדר פעולות חשבון',
    emoji: '🔢',
    color: 'from-emerald-400 to-teal-500',
    pageRange: [4, 53],
    subTopics: NATURAL_NUMBERS_B_SUBTOPICS,
  },
  {
    id: 'decimals-b',
    book: 15,
    title: 'מספרים עשרוניים – חלק ב׳',
    shortTitle: 'עשרוניים ב׳',
    description: 'כפל וחילוק של מספרים עשרוניים',
    emoji: '🎯',
    color: 'from-cyan-400 to-sky-500',
    pageRange: [54, 102],
    subTopics: DECIMALS_B_SUBTOPICS,
  },
  {
    id: 'percentages',
    book: 15,
    title: 'אחוזים',
    shortTitle: 'אחוזים',
    description: 'אחוז מכמות, המרה בין שבר, עשרוני ואחוז',
    emoji: '💯',
    color: 'from-violet-400 to-purple-500',
    pageRange: [103, 142],
    subTopics: PERCENTAGES_SUBTOPICS,
  },
  {
    id: 'average',
    book: 15,
    title: 'ממוצע',
    shortTitle: 'ממוצע',
    description: 'חישוב ממוצע של קבוצת מספרים',
    emoji: '⚖️',
    color: 'from-fuchsia-400 to-pink-500',
    pageRange: [143, 172],
    subTopics: AVERAGE_SUBTOPICS,
  },
  {
    id: 'data-research',
    book: 15,
    title: 'מחקר נתונים',
    shortTitle: 'מחקר נתונים',
    description: 'קריאת גרפים וטבלאות, מקסימום, מינימום וטווח',
    emoji: '📊',
    color: 'from-lime-400 to-green-500',
    pageRange: [173, 216],
    subTopics: DATA_RESEARCH_SUBTOPICS,
  },
]

export const TOPIC_BY_ID: Record<TopicId, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
) as Record<TopicId, Topic>

export const BOOKS = [
  { id: 14 as const, title: 'שבילים 14', subtitle: 'שברים • ספרות רומיות • עשרוניים א׳' },
  { id: 15 as const, title: 'שבילים 15', subtitle: 'טבעיים ב׳ • עשרוניים ב׳ • אחוזים • ממוצע • נתונים' },
]

/** Topics of a book, in page order. */
export function topicsForBook(book: BookId): Topic[] {
  return TOPICS.filter((t) => t.book === book).sort((a, b) => a.pageRange[0] - b.pageRange[0])
}

export function pageBoundsForBook(book: BookId): [number, number] {
  const topics = topicsForBook(book)
  const first = topics[0]?.pageRange[0] ?? 1
  const last = topics[topics.length - 1]?.pageRange[1] ?? 1
  return [first, last]
}

/** Finds which topic a given page of a book belongs to (clamped to the book's range). */
export function topicForPage(book: BookId, page: number): Topic {
  const topics = topicsForBook(book)
  const [min, max] = pageBoundsForBook(book)
  const clamped = Math.min(Math.max(page, min), max)
  return topics.find((t) => clamped >= t.pageRange[0] && clamped <= t.pageRange[1]) ?? topics[0]
}
