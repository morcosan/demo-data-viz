import i18n from 'i18next'

const formatNumber = (value?: number): string => {
  return value?.toLocaleString(i18n.language, { maximumFractionDigits: 2 }) || ''
}

const formatDate = (value?: string | Date): string => {
  return value ? new Date(value).toLocaleString(i18n.language, { dateStyle: 'long' }) : ''
}

export { formatDate, formatNumber }
