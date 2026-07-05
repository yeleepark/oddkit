import fs from 'node:fs'
import path from 'node:path'

// CLAUDE.md: "Do not make src/proxy.ts matcher dynamic. Next statically
// analyzes proxy matcher constants." So this reads the literal matcher
// string from source instead of importing the module (importing it also
// pulls in next-intl's ESM-only middleware build, which Jest can't parse).
const proxySource = fs.readFileSync(path.join(process.cwd(), 'src/proxy.ts'), 'utf-8')

const extractCatchAllMatcher = (source: string): string => {
  const match = /matcher:\s*\[([\s\S]*?)\]/.exec(source)
  if (!match) throw new Error('could not find matcher array in src/proxy.ts')
  const entries = match[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  const catchAll = entries[entries.length - 1]
  const literal = JSON.parse(catchAll.replace(/'/g, '"'))
  return literal
}

const catchAllMatches = (path: string): boolean => {
  const pattern = extractCatchAllMatcher(proxySource)
  return new RegExp(`^${pattern}$`).test(path)
}

test('점(dot)이 있는 더미 이미지 임베드 경로는 로케일 프리픽스 대상에서 제외됨', () => {
  expect(catchAllMatches('/placeholder/600x400.png')).toBe(false)
})

test('확장자 없는 잘못된 임베드 경로도 로케일 프리픽스 대상에서 제외됨', () => {
  expect(catchAllMatches('/placeholder/notaformat')).toBe(false)
})

test('기존 로케일 라우트는 여전히 매칭 대상 (회귀 없음)', () => {
  expect(catchAllMatches('/tools/dummy-image')).toBe(true)
})

test('opengraph-image 라우트는 확장자가 없어도 로케일 프리픽스 대상에서 제외됨', () => {
  expect(catchAllMatches('/opengraph-image')).toBe(false)
})

test('twitter-image 라우트도 로케일 프리픽스 대상에서 제외됨', () => {
  expect(catchAllMatches('/twitter-image')).toBe(false)
})
