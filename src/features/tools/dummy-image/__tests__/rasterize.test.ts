/**
 * @jest-environment node
 */
import sharp from 'sharp'
import { rasterizeSVG } from '@/features/tools/dummy-image/lib/rasterize'
import { generateSVG } from '@/features/tools/dummy-image/lib/svg-generator'
import { DEFAULT_DUMMY_IMAGE_CONFIG } from '@/features/tools/dummy-image/model/config'

const svg = generateSVG({ ...DEFAULT_DUMMY_IMAGE_CONFIG, width: 200, height: 100 })

test('PNG로 래스터라이징', async () => {
  const buffer = await rasterizeSVG(svg, 'png')
  const meta = await sharp(buffer).metadata()
  expect(meta.format).toBe('png')
  expect(meta.width).toBe(200)
  expect(meta.height).toBe(100)
})

test('JPG로 래스터라이징', async () => {
  const buffer = await rasterizeSVG(svg, 'jpg')
  const meta = await sharp(buffer).metadata()
  expect(meta.format).toBe('jpeg')
})

test('WebP로 래스터라이징', async () => {
  const buffer = await rasterizeSVG(svg, 'webp')
  const meta = await sharp(buffer).metadata()
  expect(meta.format).toBe('webp')
})

test('잘못된 SVG는 에러를 던짐', async () => {
  await expect(rasterizeSVG('not an svg', 'png')).rejects.toThrow()
})
