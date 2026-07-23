import type { DummyTextUnit } from '@/features/tools/dummy-text/model/types'

export const DUMMY_TEXT_UNITS: DummyTextUnit[] = ['words', 'sentences', 'paragraphs']

export const DEFAULT_DUMMY_TEXT_UNIT: DummyTextUnit = 'paragraphs'

export const DEFAULT_DUMMY_TEXT_COUNT = 3

export const DEFAULT_DUMMY_TEXT_START_WITH_LOREM = true

export const DUMMY_TEXT_COUNT_LIMITS: Record<DummyTextUnit, { min: number; max: number }> = {
  words: { min: 1, max: 500 },
  sentences: { min: 1, max: 100 },
  paragraphs: { min: 1, max: 50 },
}
