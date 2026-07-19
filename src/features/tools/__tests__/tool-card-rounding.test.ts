import { getToolCardRounding } from '@/features/tools/lib/tool-card-rounding'

describe('getToolCardRounding', () => {
  test('total 0 renders no rounding', () => {
    expect(getToolCardRounding(0, 0)).toBe('')
  })

  test('total 1: the single card is fully rounded at every breakpoint', () => {
    expect(getToolCardRounding(0, 1)).toBe('rounded-[14px]')
  })

  test('total 2 (even, one row): left card owns top-left + bottom-left', () => {
    expect(getToolCardRounding(0, 2)).toBe(
      'rounded-tl-[14px] rounded-tr-[14px] sm:rounded-tr-none sm:rounded-bl-[14px]'
    )
  })

  test('total 2 (even, one row): right card owns top-right + bottom-right', () => {
    expect(getToolCardRounding(1, 2)).toBe(
      'rounded-bl-[14px] rounded-br-[14px] sm:rounded-tr-[14px] sm:rounded-bl-none'
    )
  })

  test('total 3 (odd): first card owns top-left only', () => {
    expect(getToolCardRounding(0, 3)).toBe('rounded-tl-[14px] rounded-tr-[14px] sm:rounded-tr-none')
  })

  test('total 3 (odd): second card owns top-right only', () => {
    expect(getToolCardRounding(1, 3)).toBe('sm:rounded-tr-[14px]')
  })

  test('total 3 (odd): last card spans both desktop columns and owns both bottom corners', () => {
    expect(getToolCardRounding(2, 3)).toBe('rounded-bl-[14px] rounded-br-[14px] sm:col-span-2')
  })

  test('total 4 (even, two rows): matches original 8-item pattern for row 0', () => {
    expect(getToolCardRounding(0, 4)).toBe('rounded-tl-[14px] rounded-tr-[14px] sm:rounded-tr-none')
    expect(getToolCardRounding(1, 4)).toBe('sm:rounded-tr-[14px]')
  })

  test('total 4 (even, two rows): last row hands out bottom-left/bottom-right', () => {
    expect(getToolCardRounding(2, 4)).toBe('sm:rounded-bl-[14px]')
    expect(getToolCardRounding(3, 4)).toBe('rounded-bl-[14px] rounded-br-[14px] sm:rounded-bl-none')
  })

  test('total 5 (odd): middle-row cards get no rounding', () => {
    expect(getToolCardRounding(2, 5)).toBe('')
    expect(getToolCardRounding(3, 5)).toBe('')
  })

  test('total 5 (odd): last card still spans and owns both bottom corners', () => {
    expect(getToolCardRounding(4, 5)).toBe('rounded-bl-[14px] rounded-br-[14px] sm:col-span-2')
  })

  test('total 8 matches the original hardcoded HOME_GRID_CORNER_ROUNDING array exactly', () => {
    const expected = [
      'rounded-tl-[14px] rounded-tr-[14px] sm:rounded-tr-none',
      'sm:rounded-tr-[14px]',
      '',
      '',
      '',
      '',
      'sm:rounded-bl-[14px]',
      'rounded-bl-[14px] rounded-br-[14px] sm:rounded-bl-none',
    ]
    expected.forEach((className, index) => {
      expect(getToolCardRounding(index, 8)).toBe(className)
    })
  })
})
