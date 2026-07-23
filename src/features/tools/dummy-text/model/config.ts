import type { DummyTextLanguage } from '@/features/tools/dummy-text/model/types'

export const DUMMY_TEXT_LANGUAGES: DummyTextLanguage[] = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW', 'es']

export const DEFAULT_DUMMY_TEXT_LANGUAGE: DummyTextLanguage = 'en'

export const DEFAULT_DUMMY_TEXT_CHAR_COUNT = 200

export const DUMMY_TEXT_CHAR_COUNT_LIMITS = { min: 1, max: 5000 }
