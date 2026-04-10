import i18n from 'i18next'

const QueryOperator = {
  SPLIT: '|',
  JOIN: ' | ',
} as const

const formatNumber = (value?: number, decimals?: number): string => {
  return value !== undefined
    ? value.toLocaleString(i18n.language, {
        minimumFractionDigits: decimals || 0,
        maximumFractionDigits: 2,
      })
    : ''
}

const formatInt = (value?: number, round: 'up' | 'down' = 'up'): string => {
  if (value === undefined) return ''

  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  const snap = round === 'up' ? Math.ceil : Math.floor
  const rounded = snap(abs / 10) * 10

  if (rounded >= 1_000_000_000) {
    return sign + Math.round(rounded / 1_000_000_000) + 'b'
  }
  if (rounded >= 1_000_000) {
    return sign + Math.round(rounded / 1_000_000) + 'm'
  }
  if (rounded >= 1_000) {
    return sign + Math.round(rounded / 1_000) + 'k'
  }

  return sign + rounded.toString()
}

const formatDate = (value?: string | Date): string => {
  return value ? new Date(value).toLocaleString(i18n.language, { dateStyle: 'long' }) : ''
}

const computeTextWidth = (text: string, fontSize: number, monospace?: boolean): number => {
  const widthByChar: Record<string, number> = monospace ? MONO_WIDTH_BY_CHAR : SANS_WIDTH_BY_CHAR
  const fontScale = fontSize / 14

  let width = 0
  for (const char of text.toLowerCase()) {
    width += (widthByChar[char] || widthByChar.default) * fontScale
  }

  return Math.round(width)
}

const SANS_WIDTH_BY_CHAR = ((): Record<string, number> => {
  if (typeof document === 'undefined') return { default: 8.2 }

  const canvas = document.createElement('canvas')
  const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--ds-font-family-sans').trim()
  const ctx = canvas.getContext('2d')!
  ctx.font = `14px ${fontFamily}`

  const chars = ['f', 'i', 'j', 'l', 'r', 't', 'w', 'm', ' ', 'a']
  const widthByChar: Record<string, number> = {}
  for (const char of chars) {
    widthByChar[char] = parseFloat(ctx.measureText(char).width.toFixed(1))
  }
  widthByChar.default = widthByChar['a']
  delete widthByChar['a']

  return widthByChar
})()

const MONO_WIDTH_BY_CHAR = ((): Record<string, number> => {
  if (typeof document === 'undefined') return { default: 8.4 }

  const canvas = document.createElement('canvas')
  const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--ds-font-family-mono').trim()
  const ctx = canvas.getContext('2d')!
  ctx.font = `14px ${fontFamily}`

  return { default: parseFloat(ctx.measureText('a').width.toFixed(1)) }
})()

export { QueryOperator, computeTextWidth, formatDate, formatInt, formatNumber }
