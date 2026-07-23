export type DummyTextUnit = 'words' | 'sentences' | 'paragraphs'

export interface DummyTextOptions {
  unit: DummyTextUnit
  count: number
  startWithLorem: boolean
}
