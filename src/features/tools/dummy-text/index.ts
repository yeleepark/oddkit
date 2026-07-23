export { default as DummyTextTool } from '@/features/tools/dummy-text/components/dummy-text-tool'
export {
  DEFAULT_DUMMY_TEXT_COUNT,
  DEFAULT_DUMMY_TEXT_START_WITH_LOREM,
  DEFAULT_DUMMY_TEXT_UNIT,
  DUMMY_TEXT_COUNT_LIMITS,
  DUMMY_TEXT_UNITS,
} from '@/features/tools/dummy-text/model/config'
export type { DummyTextOptions, DummyTextUnit } from '@/features/tools/dummy-text/model/types'
export { generateDummyText } from '@/features/tools/dummy-text/lib/generate'
