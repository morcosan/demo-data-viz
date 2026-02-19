import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nConfig } from './i18n-config.ts'

const initClientI18n = () => {
  if (i18n.isInitialized) return
  i18n.use(initReactI18next).init(i18nConfig)
}

export { initClientI18n }
