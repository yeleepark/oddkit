import { countCharacters } from '@/features/tools/character-counter/lib/count'

describe('countCharacters', () => {
  test('empty string returns zero for both counts', () => {
    expect(countCharacters('')).toEqual({ withSpaces: 0, withoutSpaces: 0 })
  })

  test('counts ASCII text including and excluding spaces', () => {
    expect(countCharacters('hello world')).toEqual({ withSpaces: 11, withoutSpaces: 10 })
  })

  test('treats tabs and newlines as whitespace for the without-spaces count', () => {
    expect(countCharacters('a\tb\nc')).toEqual({ withSpaces: 5, withoutSpaces: 3 })
  })

  test('counts a multi-code-point emoji as a single character', () => {
    expect(countCharacters('😀')).toEqual({ withSpaces: 1, withoutSpaces: 1 })
  })

  test('counts Korean text correctly (single code point per syllable)', () => {
    expect(countCharacters('안녕 하세요')).toEqual({ withSpaces: 6, withoutSpaces: 5 })
  })
})
