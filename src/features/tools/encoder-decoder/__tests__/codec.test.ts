import {
  CodecError,
  decodeBase64Text,
  decodeHtmlEntitiesText,
  decodeText,
  decodeUrlText,
  encodeBase64Text,
  encodeHtmlEntitiesText,
  encodeText,
  encodeUrlText,
  transformText,
} from '@/features/tools/encoder-decoder/lib/codec'

describe('URL encode/decode', () => {
  test('encodes reserved and unicode characters', () => {
    expect(encodeUrlText('a b/c?d=1&e=2')).toBe('a%20b%2Fc%3Fd%3D1%26e%3D2')
    expect(encodeUrlText('café')).toBe('caf%C3%A9')
  })

  test('decodes back to the original text', () => {
    expect(decodeUrlText('a%20b%2Fc%3Fd%3D1%26e%3D2')).toBe('a b/c?d=1&e=2')
    expect(decodeUrlText('caf%C3%A9')).toBe('café')
  })

  test('round-trips arbitrary text', () => {
    const input = 'hello, world! 100% free — 你好'
    expect(decodeUrlText(encodeUrlText(input))).toBe(input)
  })

  test('throws CodecError with invalidUrl code on malformed percent-escapes', () => {
    expect(() => decodeUrlText('100% off')).toThrow(CodecError)
    try {
      decodeUrlText('100% off')
      throw new Error('expected decodeUrlText to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(CodecError)
      expect((error as CodecError).code).toBe('invalidUrl')
    }
  })
})

describe('Base64 encode/decode', () => {
  test('encodes ASCII and unicode text', () => {
    expect(encodeBase64Text('hello')).toBe('aGVsbG8=')
    expect(encodeBase64Text('你好')).toBe('5L2g5aW9')
  })

  test('decodes back to the original text', () => {
    expect(decodeBase64Text('aGVsbG8=')).toBe('hello')
    expect(decodeBase64Text('5L2g5aW9')).toBe('你好')
  })

  test('treats empty input as empty output', () => {
    expect(decodeBase64Text('')).toBe('')
    expect(decodeBase64Text('   ')).toBe('')
  })

  test('ignores surrounding whitespace/newlines in valid base64', () => {
    expect(decodeBase64Text('aGVs\nbG8=')).toBe('hello')
  })

  test('round-trips arbitrary text', () => {
    const input = 'The quick brown fox jumps over 13 lazy dogs! 🦊'
    expect(decodeBase64Text(encodeBase64Text(input))).toBe(input)
  })

  test('throws CodecError with invalidBase64 code on invalid characters', () => {
    expect(() => decodeBase64Text('not-valid-base64!!!')).toThrow(CodecError)
    try {
      decodeBase64Text('not valid!!')
      throw new Error('expected decodeBase64Text to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(CodecError)
      expect((error as CodecError).code).toBe('invalidBase64')
    }
  })

  test('throws CodecError on incorrect padding length', () => {
    expect(() => decodeBase64Text('abc')).toThrow(CodecError)
  })
})

describe('HTML entity encode/decode', () => {
  test('encodes special characters', () => {
    expect(encodeHtmlEntitiesText(`<div class="a">Tom & Jerry's</div>`)).toBe(
      '&lt;div class=&quot;a&quot;&gt;Tom &amp; Jerry&#39;s&lt;/div&gt;'
    )
  })

  test('decodes named entities back to characters', () => {
    expect(decodeHtmlEntitiesText('&lt;div class=&quot;a&quot;&gt;Tom &amp; Jerry&#39;s&lt;/div&gt;')).toBe(
      `<div class="a">Tom & Jerry's</div>`
    )
  })

  test('decodes numeric and hex entities', () => {
    expect(decodeHtmlEntitiesText('&#169; &#x2122;')).toBe('© ™')
  })

  test('leaves stray ampersands that are not entity-like untouched', () => {
    expect(decodeHtmlEntitiesText('AT&T runs fine')).toBe('AT&T runs fine')
  })

  test('round-trips arbitrary text', () => {
    const input = `<script>alert("hi & bye")</script>`
    expect(decodeHtmlEntitiesText(encodeHtmlEntitiesText(input))).toBe(input)
  })

  test('throws CodecError with invalidHtmlEntity code on unknown named entity', () => {
    expect(() => decodeHtmlEntitiesText('&unknownentity;')).toThrow(CodecError)
    try {
      decodeHtmlEntitiesText('&unknownentity;')
      throw new Error('expected decodeHtmlEntitiesText to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(CodecError)
      expect((error as CodecError).code).toBe('invalidHtmlEntity')
      expect((error as CodecError).detail).toBe('&unknownentity;')
    }
  })

  test('throws CodecError on out-of-range numeric entity', () => {
    expect(() => decodeHtmlEntitiesText('&#x110000;')).toThrow(CodecError)
  })
})

describe('dispatchers', () => {
  test('encodeText and decodeText route by mode', () => {
    expect(encodeText('url', 'a b')).toBe('a%20b')
    expect(decodeText('url', 'a%20b')).toBe('a b')
    expect(encodeText('base64', 'hi')).toBe('aGk=')
    expect(decodeText('base64', 'aGk=')).toBe('hi')
    expect(encodeText('html', '<a>')).toBe('&lt;a&gt;')
    expect(decodeText('html', '&lt;a&gt;')).toBe('<a>')
  })

  test('transformText routes by mode and direction', () => {
    expect(transformText('url', 'encode', 'a b')).toBe('a%20b')
    expect(transformText('base64', 'decode', 'aGk=')).toBe('hi')
    expect(transformText('html', 'encode', '<a>')).toBe('&lt;a&gt;')
  })
})
