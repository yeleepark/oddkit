export { default as DummyTextTool } from '@/features/tools/dummy-text/components/dummy-text-tool'
export {
  DEFAULT_DUMMY_TEXT_CHAR_COUNT,
  DEFAULT_DUMMY_TEXT_LANGUAGE,
  DUMMY_TEXT_CHAR_COUNT_LIMITS,
  DUMMY_TEXT_LANGUAGES,
} from '@/features/tools/dummy-text/model/config'
export type { DummyTextLanguage, DummyTextOptions } from '@/features/tools/dummy-text/model/types'
export { generateDummyText } from '@/features/tools/dummy-text/lib/generate'
