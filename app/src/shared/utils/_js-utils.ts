import i18n from 'i18next'

const LOG = (...args: unknown[]) => {
  const format: unknown[] = ['%c', 'color: lightgreen']

  for (const arg of args) {
    if (typeof arg === 'string') {
      format[0] += '%s '
    } else {
      break
    }
  }

  format[0] = (format[0] as string).trim()

  console.log(...format.concat(args))
}

const formatNumber = (value?: number): string => {
  return value?.toLocaleString(i18n.language, { maximumFractionDigits: 2 }) || ''
}

const formatDate = (value?: string | Date): string => {
  return value ? new Date(value).toLocaleString(i18n.language, { dateStyle: 'long' }) : ''
}

export { LOG, formatDate, formatNumber }
