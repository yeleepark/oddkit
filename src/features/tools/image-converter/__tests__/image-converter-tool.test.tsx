import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ImageConverterTool from '@/features/tools/image-converter/components/image-converter-tool'
import { convertImage } from '@/features/tools/image-converter/lib/converter'
import mockKoMessages from '@/messages/ko.json'

jest.mock('next-intl', () => {
  const readMessage = (path: string) =>
    path.split('.').reduce<unknown>((current, segment) => {
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
  Link: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/features/tools/image-converter/lib/converter', () => ({
  convertImage: jest.fn(),
}))

const mockedConvertImage = jest.mocked(convertImage)

async function renderTool() {
  const result = render(<ImageConverterTool />)
  await screen.findByRole('heading', { name: '이미지 포맷 변환기' })
  return result
}

describe('ImageConverterTool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:converted-preview')
    global.URL.revokeObjectURL = jest.fn()
  })

  test('초기 화면: 업로드 전에는 안내 문구와 기본 WebP 포맷을 보여주고 변환 버튼은 비활성화된다', async () => {
    await renderTool()

    expect(screen.getByRole('heading', { name: '이미지 포맷 변환기' })).toBeInTheDocument()
    expect(
      screen.getByText('이미지를 업로드하면 여기에서 미리 볼 수 있습니다.')
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '출력 포맷' })).toHaveValue('webp')
    expect(screen.getByRole('button', { name: '이미지 변환' })).toBeDisabled()
    expect(screen.getByText('변환 · webp · 서버 업로드 없음')).toBeInTheDocument()
  })

  test('잘못된 파일: JPG/PNG/WebP가 아닌 파일을 선택하면 에러를 표시하고 변환을 실행하지 않는다', async () => {
    await renderTool()

    const fileInput = screen.getByLabelText('이미지') as HTMLInputElement
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['plain text'], 'note.txt', { type: 'text/plain' })],
      },
    })

    expect(
      screen.getByText('지원하지 않는 파일 형식입니다. JPG, PNG, WebP 이미지를 선택하세요.')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '이미지 변환' })).toBeDisabled()
    expect(mockedConvertImage).not.toHaveBeenCalled()
  })

  test('성공 흐름: 파일 선택 후 포맷과 품질을 바꾸고 변환하면 결과 통계와 다운로드 링크를 표시한다', async () => {
    const sourceFile = new File(['source image bytes'], 'photo.png', { type: 'image/png' })
    mockedConvertImage.mockResolvedValue({
      blob: new Blob(['converted'], { type: 'image/jpeg' }),
      filename: 'photo.jpg',
      height: 600,
      originalSize: sourceFile.size,
      size: 1234,
      type: 'image/jpeg',
      width: 800,
    })

    await renderTool()

    fireEvent.change(screen.getByLabelText('이미지'), {
      target: { files: [sourceFile] },
    })
    fireEvent.change(screen.getByRole('combobox', { name: '출력 포맷' }), {
      target: { value: 'jpeg' },
    })
    fireEvent.change(screen.getByLabelText('품질: 90%'), {
      target: { value: '0.65' },
    })
    fireEvent.click(screen.getByRole('button', { name: '이미지 변환' }))

    await waitFor(() => {
      expect(mockedConvertImage).toHaveBeenCalledWith(sourceFile, {
        format: 'jpeg',
        quality: 0.65,
      })
    })

    expect(screen.getByText('1.21 KB')).toBeInTheDocument()
    expect(screen.getByText('JPEG')).toBeInTheDocument()
    expect(screen.getByText('800x600')).toBeInTheDocument()

    const downloadLink = screen.getByRole('link', { name: '변환된 이미지 다운로드' })
    expect(downloadLink).toHaveAttribute('href', 'blob:converted-preview')
    expect(downloadLink).toHaveAttribute('download', 'photo.jpg')
  })
})
