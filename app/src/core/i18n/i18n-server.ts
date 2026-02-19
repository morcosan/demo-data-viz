import { createInstance } from 'i18next'
import { DEFAULT_LOCALE, I18N_NAMESPACE, i18nConfig, type Locale } from './i18n-config.ts'

const getServerT = async (locale: Locale = DEFAULT_LOCALE) => {
  const i18nInstance = createInstance()

  const translation = await import(`./translations/${locale}.json`).then((m) => m.default)

  await i18nInstance.init({
    ...i18nConfig,
    lng: locale,
    resources: {
      [locale]: { [I18N_NAMESPACE]: translation },
    },
  })

  return i18nInstance.getFixedT(locale)
}

export { getServerT }
