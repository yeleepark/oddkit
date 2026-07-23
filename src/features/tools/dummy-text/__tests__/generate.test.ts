import { generateDummyText } from '@/features/tools/dummy-text/lib/generate'

function fixedRng(sequence: number[]): () => number {
  let i = 0
  return () => sequence[i++ % sequence.length]
}

describe('generateDummyText', () => {
  it('returns an empty string when charCount is zero or negative', () => {
    expect(generateDummyText({ language: 'en', charCount: 0 })).toBe('')
    expect(generateDummyText({ language: 'ko', charCount: -1 })).toBe('')
  })

  it('generates exactly the requested character count for word-based languages', () => {
    expect(generateDummyText({ language: 'en', charCount: 120 })).toHaveLength(120)
    expect(generateDummyText({ language: 'es', charCount: 75 })).toHaveLength(75)
  })

  it('generates exactly the requested character count for character-pool languages', () => {
    expect(generateDummyText({ language: 'ko', charCount: 50 })).toHaveLength(50)
    expect(generateDummyText({ language: 'ja', charCount: 50 })).toHaveLength(50)
    expect(generateDummyText({ language: 'zh-CN', charCount: 50 })).toHaveLength(50)
    expect(generateDummyText({ language: 'zh-TW', charCount: 50 })).toHaveLength(50)
  })

  it('capitalizes the first letter for word-based languages', () => {
    const text = generateDummyText({ language: 'en', charCount: 40 })
    expect(text[0]).toBe(text[0].toUpperCase())
  })

  it('is deterministic for a given rng sequence', () => {
    const rng = fixedRng([0, 0.2, 0.4, 0.6, 0.8])
    const first = generateDummyText({ language: 'en', charCount: 30 }, rng)
    const secondRng = fixedRng([0, 0.2, 0.4, 0.6, 0.8])
    const second = generateDummyText({ language: 'en', charCount: 30 }, secondRng)
    expect(first).toBe(second)
  })
})
