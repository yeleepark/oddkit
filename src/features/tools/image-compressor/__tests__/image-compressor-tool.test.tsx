import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ImageCompressorTool from '@/features/tools/image-compressor/components/image-compressor-tool'
import { compressImage } from '@/features/tools/image-compressor/lib/compressor'
import mockKoMessages from '@/messages/ko.json'

jest.mock('next-intl', () => {
  const readMessage = (path: string) => path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[segment]
  }, mockKoMessages)

  const interpolate = (message: string, values?: Record<string, string | number>) => {
    if (!values) return message
    return Object.entries(values).reduce(
      (current, [key, value]) => current.replaceAll(`{${key}}`, String(value)),
      message
    )
  }

  return {
    useTranslations: (namespace?: string) => {
      const translate = (key: string, values?: Record<string, string | number>) => {
        const path = namespace ? `${namespace}.${key}` : key
        const message = readMessage(path)
        if (typeof message !== 'string') throw new Error(`Missing mock translation: ${path}`)
        return interpolate(message, values)
      }
      translate.raw = (key: string) => readMessage(namespace ? `${namespace}.${key}` : key)
      return translate
    },
  }
})

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

jest.mock('@/features/tools/image-compressor/lib/compressor', () => ({
  compressImage: jest.fn(),
}))

const mockedCompressImage = jest.mocked(compressImage)

async function renderTool() {
  const result = render(<ImageCompressorTool />)
  await screen.findByRole('heading', { name: '이미지 압축' })
  return result
}

describe('ImageCompressorTool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:compressed-preview')
    global.URL.revokeObjectURL = jest.fn()
  })

  test('초기 화면: 수동 품질 모드와 기본 최대 크기를 표시하고 파일이 없으면 압축할 수 없다', async () => {
    await renderTool()

    expect(screen.getByRole('heading', { name: '이미지 압축' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '수동 품질' })).toHaveClass('tool-chip-active')
    expect(screen.getByLabelText('품질: 80%')).toBeInTheDocument()
    expect(screen.getByLabelText('max width')).toHaveValue(1920)
    expect(screen.getByLabelText('max height')).toHaveValue(1920)
    expect(screen.getByRole('button', { name: (name, element) => name === '이미지 압축' && (element as HTMLElement).classList.contains('tool-primary') })).toBeDisabled()
  })

  test('목표 용량 모드: WebP 출력과 목표 KB 값을 선택하면 압축 옵션에 그대로 전달한다', async () => {
    const sourceFile = new File(['image bytes'], 'large.png', { type: 'image/png' })
    mockedCompressImage.mockResolvedValue({
      blob: new Blob(['small'], { type: 'image/webp' }),
      filename: 'large-compressed.webp',
      height: 720,
      originalSize: 10000,
      quality: 0.74,
      size: 2500,
      targetReached: true,
      type: 'image/webp',
      width: 1280,
    })

    await renderTool()

    fireEvent.change(screen.getByLabelText('이미지'), {
      target: { files: [sourceFile] },
    })
    fireEvent.click(screen.getByRole('button', { name: '목표 용량' }))
    fireEvent.change(screen.getByLabelText('목표 용량'), {
      target: { value: '120' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: '출력 포맷' }), {
      target: { value: 'webp' },
    })
    fireEvent.click(screen.getByRole('button', { name: (name, element) => name === '이미지 압축' && (element as HTMLElement).classList.contains('tool-primary') }))

    await waitFor(() => {
      expect(mockedCompressImage).toHaveBeenCalledWith(sourceFile, {
        format: 'webp',
        maxHeight: 1920,
        maxWidth: 1920,
        mode: 'target',
        quality: 0.8,
        targetSize: 120,
        targetUnit: 'kb',
      })
    })

    expect(screen.getByText('2.44 KB')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('달성')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '압축 이미지 다운로드' })).toHaveAttribute(
      'download',
      'large-compressed.webp'
    )
  })

  test('실패 흐름: 압축 중 예외가 발생하면 사용자에게 실패 메시지를 보여준다', async () => {
    mockedCompressImage.mockRejectedValue(new Error('canvas failed'))
    await renderTool()

    fireEvent.change(screen.getByLabelText('이미지'), {
      target: { files: [new File(['broken'], 'broken.webp', { type: 'image/webp' })] },
    })
    fireEvent.click(screen.getByRole('button', { name: (name, element) => name === '이미지 압축' && (element as HTMLElement).classList.contains('tool-primary') }))

    expect(await screen.findByText('이미지를 압축할 수 없습니다. 다른 파일이나 포맷을 시도하세요.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '압축 이미지 다운로드' })).not.toBeInTheDocument()
  })
})
