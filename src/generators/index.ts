import type { Level, Question, QuestionGenerator, TopicId } from '../types'
import { generateFractionsB, FRACTIONS_B_SUBTOPICS } from './fractionsB'
import { generateRomanNumerals, ROMAN_NUMERALS_SUBTOPICS } from './romanNumerals'
import { generateDecimalsA, DECIMALS_A_SUBTOPICS } from './decimalsA'
import { generateNaturalNumbersB, NATURAL_NUMBERS_B_SUBTOPICS } from './naturalNumbersB'
import { generateDecimalsB, DECIMALS_B_SUBTOPICS } from './decimalsB'
import { generatePercentages, PERCENTAGES_SUBTOPICS } from './percentages'
import { generateAverage, AVERAGE_SUBTOPICS } from './average'
import { generateDataResearch, DATA_RESEARCH_SUBTOPICS } from './dataResearch'

export const GENERATORS: Record<TopicId, QuestionGenerator> = {
  'fractions-b': generateFractionsB,
  'roman-numerals': generateRomanNumerals,
  'decimals-a': generateDecimalsA,
  'natural-numbers-b': generateNaturalNumbersB,
  'decimals-b': generateDecimalsB,
  percentages: generatePercentages,
  average: generateAverage,
  'data-research': generateDataResearch,
}

/** Per-topic registry of named sub-skill generators ("חלק א'", "חלק ב'", ...). */
export const SUB_GENERATORS: Record<TopicId, Record<string, QuestionGenerator>> = {
  'fractions-b': FRACTIONS_B_SUBTOPICS,
  'roman-numerals': ROMAN_NUMERALS_SUBTOPICS,
  'decimals-a': DECIMALS_A_SUBTOPICS,
  'natural-numbers-b': NATURAL_NUMBERS_B_SUBTOPICS,
  'decimals-b': DECIMALS_B_SUBTOPICS,
  percentages: PERCENTAGES_SUBTOPICS,
  average: AVERAGE_SUBTOPICS,
  'data-research': DATA_RESEARCH_SUBTOPICS,
}

/**
 * Generates a question for a topic. When `subTopicId` is given and known, it
 * generates only that sub-skill; otherwise it mixes across the whole topic.
 */
export function generateQuestion(topicId: TopicId, level: Level, subTopicId?: string | null): Question {
  const subFn = subTopicId ? SUB_GENERATORS[topicId]?.[subTopicId] : undefined
  return (subFn ?? GENERATORS[topicId])(level)
}
