declare module 'gif.js' {
  interface GIFOptions {
    workers?: number
    quality?: number
    workerScript?: string
    width?: number
    height?: number
  }

  class GIF {
    constructor(options: GIFOptions)
    addFrame(canvas: HTMLCanvasElement, options?: { delay?: number; copy?: boolean }): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    render(): void
  }

  export = GIF
}
