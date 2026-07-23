import type { CharacterCount } from '@/features/tools/character-counter/model/types'

/**
 * Counts characters in text by Unicode code point, both including and
 * excluding whitespace.
 *
 * @param {string} text - The text to count.
 * @returns {CharacterCount} Character counts with and without whitespace.
 */
export function countCharacters(text: string): CharacterCount {
  const withSpaces = [...text].length
  const withoutSpaces = [...text.replace(/\s/g, '')].length
  return { withSpaces, withoutSpaces }
}
