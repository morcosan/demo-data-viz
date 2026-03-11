import i18n from 'i18next'

const formatNumber = (value?: number): string => {
  return value?.toLocaleString(i18n.language, { maximumFractionDigits: 2 }) || ''
}

const formatDate = (value?: string | Date): string => {
  return value ? new Date(value).toLocaleString(i18n.language, { dateStyle: 'long' }) : ''
}

const computeTextWidth = (text: string, fontSize: number): number => {
  const widthByChar: Record<string, number> = {
    f: 7.5,
    i: 4.5,
    j: 4.5,
    l: 4.5,
    r: 5.5,
    t: 6.0,
    m: 13.0,
    w: 12.0,
    ' ': 3.5,
    default: 8.2,
  }
  const fontScale = fontSize / 14

  let width = 0
  for (const char of text.toLowerCase()) {
    width += (widthByChar[char] || widthByChar.default) * fontScale
  }

  return Math.round(width)
}

export { computeTextWidth, formatDate, formatNumber }
