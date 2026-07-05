import sharp from 'sharp'
import type { PlaceholderFormat } from '@/features/tools/dummy-image/lib/parse-placeholder-request'

export async function rasterizeSVG(svg: string, format: PlaceholderFormat): Promise<Buffer> {
  const image = sharp(Buffer.from(svg))

  switch (format) {
    case 'png':
      return image.png().toBuffer()
    case 'jpg':
      return image.jpeg().toBuffer()
    case 'webp':
      return image.webp().toBuffer()
  }
}
