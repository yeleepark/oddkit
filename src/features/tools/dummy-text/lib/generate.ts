import type { DummyTextOptions, DummyTextLanguage } from '@/features/tools/dummy-text/model/types'

const WORD_BANKS: Record<'en' | 'es', string[]> = {
  en: [
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
  ],
  es: [
    'el',
    'la',
    'de',
    'que',
    'y',
    'en',
    'un',
    'ser',
    'se',
    'no',
    'haber',
    'por',
    'con',
    'su',
    'para',
    'como',
    'estar',
    'tener',
    'le',
    'lo',
    'todo',
    'pero',
    'mas',
    'hacer',
    'poder',
    'decir',
    'este',
    'ir',
    'otro',
    'ese',
  ],
}

const CHAR_POOLS: Record<'ko' | 'ja' | 'zh-CN' | 'zh-TW', string> = {
  ko: '가나다라마바사아자차카타파하고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후그느드르므브스으즈츠크트프흐',
  ja: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでど',
  'zh-CN':
    '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定',
  'zh-TW':
    '的一是在不了有和人這中大為上個國我以要他時來用們生到作地於出就分對成會可主發年動同工也能下過子說產種面而方後多定',
}

function randomWord(pool: string[], rng: () => number): string {
  return pool[Math.floor(rng() * pool.length)]
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function buildWordBasedText(language: 'en' | 'es', charCount: number, rng: () => number): string {
  const pool = WORD_BANKS[language]
  let result = ''
  while (result.length < charCount) {
    if (result.length > 0) result += ' '
    result += randomWord(pool, rng)
  }
  return capitalize(result).slice(0, charCount)
}

function buildCharPoolText(
  language: 'ko' | 'ja' | 'zh-CN' | 'zh-TW',
  charCount: number,
  rng: () => number
): string {
  const pool = CHAR_POOLS[language]
  let result = ''
  while (result.length < charCount) {
    result += pool.charAt(Math.floor(rng() * pool.length))
  }
  return result.slice(0, charCount)
}

export function generateDummyText(
  options: DummyTextOptions,
  rng: () => number = Math.random
): string {
  const { language, charCount } = options
  if (charCount <= 0) return ''

  return isWordBasedLanguage(language)
    ? buildWordBasedText(language, charCount, rng)
    : buildCharPoolText(language, charCount, rng)
}

function isWordBasedLanguage(language: DummyTextLanguage): language is 'en' | 'es' {
  return language === 'en' || language === 'es'
}
