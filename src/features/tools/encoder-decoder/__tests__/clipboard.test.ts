import { copyToClipboard } from '@/features/tools/encoder-decoder/lib/clipboard'

describe('copyToClipboard', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('uses navigator.clipboard.writeText when available and resolves true', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    const result = await copyToClipboard('hello world')

    expect(writeText).toHaveBeenCalledWith('hello world')
    expect(result).toBe(true)
  })

  test('falls back to execCommand when clipboard API throws', async () => {
    const writeText = jest.fn().mockRejectedValue(new Error('denied'))
    Object.assign(navigator, { clipboard: { writeText } })
    document.execCommand = jest.fn().mockReturnValue(true)

    const result = await copyToClipboard('fallback text')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
  })

  test('falls back to execCommand when clipboard API is unavailable', async () => {
    Object.assign(navigator, { clipboard: undefined })
    document.execCommand = jest.fn().mockReturnValue(true)

    const result = await copyToClipboard('no clipboard api')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
  })

  test('returns false when both clipboard API and execCommand fail', async () => {
    Object.assign(navigator, { clipboard: undefined })
    document.execCommand = jest.fn().mockReturnValue(false)

    const result = await copyToClipboard('nope')

    expect(result).toBe(false)
  })
})
