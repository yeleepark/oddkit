import { DUMMY_IMAGE_GIF_CONFIG } from '@/features/tools/dummy-image/model/config'

export async function generateGIF(canvas: HTMLCanvasElement): Promise<Blob> {
  const GIF = (await import('gif.js')).default
  return new Promise((resolve) => {
    const gif = new GIF({
      workers: DUMMY_IMAGE_GIF_CONFIG.workers,
      quality: DUMMY_IMAGE_GIF_CONFIG.quality,
      workerScript: DUMMY_IMAGE_GIF_CONFIG.workerScript,
      width: canvas.width,
      height: canvas.height,
    })
    gif.addFrame(canvas, { copy: true, delay: 0 })
    gif.on('finished', (blob: Blob) => resolve(blob))
    gif.render()
  })
}
