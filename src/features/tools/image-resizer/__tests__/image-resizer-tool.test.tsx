import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ImageResizerTool from '@/features/tools/image-resizer/components/image-resizer-tool'
import { resizeImage } from '@/features/tools/image-resizer/lib/resizer'
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

jest.mock('@/features/tools/image-resizer/lib/resizer', () => ({
  resizeImage: jest.fn(),
}))

const mockedResizeImage = jest.mocked(resizeImage)

class LoadedImageMock {
  naturalWidth = 1600
  naturalHeight = 900
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  set src(_value: string) {
    queueMicrotask(() => this.onload?.())
  }
}

async function renderTool() {
  const result = render(<ImageResizerTool />)
  await screen.findByRole('heading', { name: '이미지 리사이저' })
  return result
}

describe('ImageResizerTool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:resized-preview')
    global.URL.revokeObjectURL = jest.fn()
    global.Image = LoadedImageMock as unknown as typeof Image
  })

  test('초기 화면: 파일이 없으면 기본 크기와 비율 유지 옵션을 보여주고 실행 버튼은 비활성화된다', async () => {
    await renderTool()

    expect(screen.getByRole('heading', { name: '이미지 리사이저' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('800')).toBeInTheDocument()
    expect(screen.getByDisplayValue('600')).toBeInTheDocument()
    expect(screen.getByLabelText('비율 유지')).toBeChecked()
    expect(screen.getByRole('button', { name: '이미지 리사이즈' })).toBeDisabled()
  })

  test('파일 선택: 원본 이미지 크기를 읽고 50% 프리셋을 누르면 800x450으로 설정된다', async () => {
    await renderTool()

    fireEvent.change(screen.getByLabelText('이미지'), {
      target: { files: [new File(['image'], 'wide.jpg', { type: 'image/jpeg' })] },
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('1600')).toBeInTheDocument()
      expect(screen.getByDisplayValue('900')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '50%' }))

    expect(screen.getByDisplayValue('800')).toBeInTheDocument()
    expect(screen.getByDisplayValue('450')).toBeInTheDocument()
    expect(screen.getByText('리사이즈 · 800x450 · 서버 업로드 없음')).toBeInTheDocument()
  })

  test('성공 흐름: 비율 유지 상태에서 너비를 바꾸고 WebP로 저장하면 계산된 크기와 옵션을 전달한다', async () => {
    const sourceFile = new File(['image'], 'wide.jpg', { type: 'image/jpeg' })
    mockedResizeImage.mockResolvedValue({
      blob: new Blob(['resized'], { type: 'image/webp' }),
      filename: 'wide-resized.webp',
      height: 540,
      originalHeight: 900,
      originalSize: sourceFile.size,
      originalWidth: 1600,
      size: 1500,
      type: 'image/webp',
      width: 960,
    })

    await renderTool()

    fireEvent.change(screen.getByLabelText('이미지'), {
      target: { files: [sourceFile] },
    })

    await waitFor(() => expect(screen.getByDisplayValue('1600')).toBeInTheDocument())

    fireEvent.change(screen.getByDisplayValue('1600'), {
      target: { value: '960' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: '출력 포맷' }), {
      target: { value: 'webp' },
    })
    fireEvent.click(screen.getByRole('button', { name: '이미지 리사이즈' }))

    await waitFor(() => {
      expect(mockedResizeImage).toHaveBeenCalledWith(sourceFile, {
        format: 'webp',
        height: 540,
        keepAspectRatio: true,
        quality: 0.9,
        width: 960,
      })
    })

    expect(screen.getByText('1600x900')).toBeInTheDocument()
    expect(screen.getByText('960x540')).toBeInTheDocument()
    expect(screen.getByText('1.46 KB')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '리사이즈된 이미지 다운로드' })).toHaveAttribute(
      'download',
      'wide-resized.webp'
    )
  })
})
