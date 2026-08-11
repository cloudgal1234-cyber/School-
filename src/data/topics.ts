import type { BookId, SubTopic, Topic, TopicId } from '../types'

/**
 * ספר 14 מבוסס על צילומים אמיתיים של תוכן העניינים מהעותק הפיזי של
 * המשתמש/ת (שברים חלק ב', עמ' 4–109; עשרוניים חלק א', עמ' 128–212):
 *  - שברים: 4 שווים, 8 הרחבה, 28 צמצום, 37 הרחבה וצמצום, 55 מכנה משותף,
 *    73 חיבור/חיסור מכנים שונים, 100 חזרה — פרק נסגר בעמ' 109.
 *  - עשרוניים א': 128 פעילות פתיחה+עשיריות היכרות, 151 עשיריות חיבור
 *    וחיסור, 163 מאיות היכרות, 186 מאיות חיבור וחיסור, 196 חזרה — פרק
 *    נסגר בעמ' 212.
 * עמ' 110–127 (18 עמ') לא הופיעו באף אחד משני הצילומים שנמסרו — כדי
 * שניווט "לפי עמוד" יישאר רציף בלי "חור", הארכתי את "חזרה" של שברים
 * (חלוקה משוערת שלי, לא מאושרת) עד 127 במקום לעצור ב-109 כפי שבאמת כתוב
 * בספר. אם יש שם נושא נוסף – נא לתקן. גם עמ' 213 והלאה (אם יש) לא נכללו.
 * לא בטוח לגבי ספר 14 בשלמותו לכן שווה לוודא מול הספר.
 *
 * ספר 15 (מספרים טבעיים ב', עשרוניים ב', אחוזים, ממוצע, מחקר נתונים) עדיין
 * מבוסס על חיפוש כללי באינטרנט בלבד — אין לי תוכן עניינים מדויק שלו, אז
 * מספרי העמודים שם הם עדיין הערכה יחסית (עד שיימסר תוכן עניינים אמיתי,
 * כפי שנעשה לספר 14).
 *
 * pageRange מחלק כל ספר ליחידות, לניווט "לפי עמוד". subTopics מפרקים כל
 * נושא לתת-נושאים שתואמים למחוללי השאלות ב-src/generators.
 */

const FRACTIONS_B_SUBTOPICS: SubTopic[] = [
  { id: 'equivalent', label: 'עמ׳ 4–7', description: 'שברים שווים' },
  { id: 'expand', label: 'עמ׳ 8–27', description: 'הרחבה' },
  { id: 'reduce', label: 'עמ׳ 28–36', description: 'צמצום' },
  { id: 'expand-reduce', label: 'עמ׳ 37–54', description: 'הרחבה וצמצום' },
  { id: 'common-denominator', label: 'עמ׳ 55–72', description: 'מכנה משותף' },
  { id: 'add-sub-unlike', label: 'עמ׳ 73–99', description: 'חיבור וחיסור שברים עם מכנים שונים' },
  { id: 'review', label: 'עמ׳ 100–127', description: 'חזרה (בספר: 100–109, הוארך עד 127 באופן משוער)' },
]

const DECIMALS_A_SUBTOPICS: SubTopic[] = [
  { id: 'tenths-intro', label: 'עמ׳ 128–150', description: 'עשיריות – הכרה' },
  { id: 'tenths-add-sub', label: 'עמ׳ 151–162', description: 'עשיריות – חיבור וחיסור' },
  { id: 'hundredths-intro', label: 'עמ׳ 163–185', description: 'מאיות – הכרה' },
  { id: 'hundredths-add-sub', label: 'עמ׳ 186–195', description: 'מאיות – חיבור וחיסור' },
  { id: 'review', label: 'עמ׳ 196–212', description: 'חזרה כללית' },
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
    description: 'שברים שווים, הרחבה, צמצום, מכנה משותף, חיבור וחיסור',
    emoji: '🍕',
    color: 'from-rose-400 to-pink-500',
    pageRange: [4, 127],
    subTopics: FRACTIONS_B_SUBTOPICS,
  },
  {
    id: 'decimals-a',
    book: 14,
    title: 'מספרים עשרוניים – חלק א׳',
    shortTitle: 'עשרוניים א׳',
    description: 'עשיריות ומאיות: הכרה, חיבור וחיסור',
    emoji: '🔟',
    color: 'from-sky-400 to-blue-500',
    pageRange: [128, 212],
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
  { id: 14 as const, title: 'שבילים 14', subtitle: 'שברים • עשרוניים א׳' },
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
