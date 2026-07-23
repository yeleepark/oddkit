import type { DummyTextOptions } from '@/features/tools/dummy-text/model/types'

const WORD_BANK = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
] as const

const CLASSIC_OPENER_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet']

const SENTENCE_WORD_RANGE = { min: 6, max: 14 }
const PARAGRAPH_SENTENCE_RANGE = { min: 3, max: 7 }

function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function randomWord(rng: () => number): string {
  return WORD_BANK[Math.floor(rng() * WORD_BANK.length)]
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function buildWords(count: number, rng: () => number): string[] {
  return Array.from({ length: count }, () => randomWord(rng))
}

function buildSentence(rng: () => number): string {
  const wordCount = randomInt(SENTENCE_WORD_RANGE.min, SENTENCE_WORD_RANGE.max, rng)
  const words = buildWords(wordCount, rng)
  return `${capitalize(words[0])} ${words.slice(1).join(' ')}.`
}

function buildParagraph(rng: () => number): string {
  const sentenceCount = randomInt(
    PARAGRAPH_SENTENCE_RANGE.min,
    PARAGRAPH_SENTENCE_RANGE.max,
    rng
  )
  return Array.from({ length: sentenceCount }, () => buildSentence(rng)).join(' ')
}

const CLASSIC_OPENER_SENTENCE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export function generateDummyText(
  options: DummyTextOptions,
  rng: () => number = Math.random
): string {
  const { unit, count, startWithLorem } = options
  if (count <= 0) return ''

  if (unit === 'words') {
    const words = buildWords(count, rng)
    if (startWithLorem) {
      const openerLength = Math.min(count, CLASSIC_OPENER_WORDS.length)
      for (let i = 0; i < openerLength; i++) {
        words[i] = CLASSIC_OPENER_WORDS[i]
      }
    }
    return capitalize(words.join(' '))
  }

  if (unit === 'sentences') {
    const sentences = Array.from({ length: count }, () => buildSentence(rng))
    if (startWithLorem) {
      sentences[0] = CLASSIC_OPENER_SENTENCE
    }
    return sentences.join(' ')
  }

  const paragraphs = Array.from({ length: count }, () => buildParagraph(rng))
  if (startWithLorem) {
    paragraphs[0] = `${CLASSIC_OPENER_SENTENCE} ${paragraphs[0]}`
  }
  return paragraphs.join('\n\n')
}
