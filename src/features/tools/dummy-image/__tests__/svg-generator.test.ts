import { generateSVG } from '@/features/tools/dummy-image/lib/svg-generator'
import { DEFAULT_DUMMY_IMAGE_CONFIG } from '@/features/tools/dummy-image/model/config'

const base = { ...DEFAULT_DUMMY_IMAGE_CONFIG }

test('단색: SVG 문자열에 크기·배경색·텍스트 포함', () => {
  const svg = generateSVG({
    ...base,
    type: 'solid',
    width: 200,
    height: 100,
    primaryColor: '#ff0000',
    text: '200x100',
  })
  expect(svg).toContain('<svg')
  expect(svg).toContain('width="200"')
  expect(svg).toContain('height="100"')
  expect(svg).toContain('fill="#ff0000"')
  expect(svg).toContain('200x100')
})

test('단색: text가 빈 문자열이면 widthxheight를 표시', () => {
  const svg = generateSVG({ ...base, type: 'solid', width: 300, height: 150, text: '' })
  expect(svg).toContain('300x150')
})

test('그라디언트: linearGradient 포함', () => {
  const svg = generateSVG({
    ...base,
    type: 'gradient',
    primaryColor: '#ff0000',
    secondaryColor: '#0000ff',
    gradientDirection: 'horizontal',
  })
  expect(svg).toContain('linearGradient')
  expect(svg).toContain('#ff0000')
  expect(svg).toContain('#0000ff')
})

test('패턴(격자): pattern 요소 포함', () => {
  const svg = generateSVG({ ...base, type: 'pattern', patternStyle: 'grid' })
  expect(svg).toContain('<pattern')
})

test('패턴(점): circle 요소 포함', () => {
  const svg = generateSVG({ ...base, type: 'pattern', patternStyle: 'dots' })
  expect(svg).toContain('<circle')
})
