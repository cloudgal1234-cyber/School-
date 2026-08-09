import type { Level, Question, QuestionGenerator, TopicId } from '../types'
import { generateFractionsB } from './fractionsB'
import { generateRomanNumerals } from './romanNumerals'
import { generateDecimalsA } from './decimalsA'
import { generateNaturalNumbersB } from './naturalNumbersB'
import { generateDecimalsB } from './decimalsB'
import { generatePercentages } from './percentages'
import { generateAverage } from './average'
import { generateDataResearch } from './dataResearch'

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

export function generateQuestion(topicId: TopicId, level: Level): Question {
  return GENERATORS[topicId](level)
}
