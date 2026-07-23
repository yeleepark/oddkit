import { generateDummyText } from '@/features/tools/dummy-text/lib/generate'

function fixedRng(sequence: number[]): () => number {
  let i = 0
  return () => sequence[i++ % sequence.length]
}

describe('generateDummyText', () => {
  it('returns an empty string when count is zero or negative', () => {
    expect(generateDummyText({ unit: 'words', count: 0, startWithLorem: false })).toBe('')
    expect(generateDummyText({ unit: 'paragraphs', count: -1, startWithLorem: false })).toBe('')
  })

  it('generates the exact number of words', () => {
    const text = generateDummyText({ unit: 'words', count: 10, startWithLorem: false })
    expect(text.split(' ')).toHaveLength(10)
  })

  it('capitalizes the first word', () => {
    const text = generateDummyText({ unit: 'words', count: 5, startWithLorem: false })
    expect(text[0]).toBe(text[0].toUpperCase())
  })

  it('generates the exact number of sentences', () => {
    const text = generateDummyText({ unit: 'sentences', count: 4, startWithLorem: false })
    const sentences = text.split('. ').filter(Boolean)
    expect(sentences).toHaveLength(4)
  })

  it('generates the exact number of paragraphs', () => {
    const text = generateDummyText({ unit: 'paragraphs', count: 3, startWithLorem: false })
    const paragraphs = text.split('\n\n')
    expect(paragraphs).toHaveLength(3)
  })

  it('starts with the classic lorem ipsum opener for words', () => {
    const text = generateDummyText({ unit: 'words', count: 8, startWithLorem: true })
    expect(text.toLowerCase().startsWith('lorem ipsum dolor sit amet')).toBe(true)
  })

  it('starts with the classic lorem ipsum opener for sentences', () => {
    const text = generateDummyText({ unit: 'sentences', count: 2, startWithLorem: true })
    expect(text.startsWith('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')).toBe(true)
  })

  it('starts with the classic lorem ipsum opener for paragraphs', () => {
    const text = generateDummyText({ unit: 'paragraphs', count: 2, startWithLorem: true })
    expect(text.startsWith('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')).toBe(true)
  })

  it('is deterministic for a given rng sequence', () => {
    const rng = fixedRng([0, 0.2, 0.4, 0.6, 0.8])
    const first = generateDummyText({ unit: 'words', count: 5, startWithLorem: false }, rng)
    const secondRng = fixedRng([0, 0.2, 0.4, 0.6, 0.8])
    const second = generateDummyText({ unit: 'words', count: 5, startWithLorem: false }, secondRng)
    expect(first).toBe(second)
  })
})
