'use client'

import { I18nService } from '@ds/core.ts'
import countries from 'i18n-iso-countries'
import i18n from 'i18next'
import { useEffect, useState } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { I18N_NAMESPACE, type Locale } from './i18n-config.ts'

interface I18nWrapperProps extends ReactProps {
  loading?: boolean
}

const I18nWrapper = ({ loading, children }: I18nWrapperProps) => {
  const { t } = useTranslation()
  return (
    <I18nService translate={t as any} loading={loading}>
      {children}
    </I18nService>
  )
}

const I18nProvider = ({ children }: ReactProps) => {
  const [loading, setLoading] = useState(false)
  const setHtmlAttr = (locale: Locale) => (document.documentElement.lang = locale)
  const isLocaleReady = (locale: Locale) => Boolean(i18n.getResourceBundle(locale, I18N_NAMESPACE))

  const fetchTranslations = async (locale: Locale) => {
    if (isLocaleReady(locale)) return
    try {
      setLoading(true)

      const json = (await import(`./translations/${locale}.json`)).default
      i18n.addResourceBundle(locale, I18N_NAMESPACE, json, true, true)

      const json2 = (await import(`./countries/${locale}.ts`)).default
      countries.registerLocale(json2)
    } catch (error) {
      console.error(`Failed loading i18n for '${locale}'\n`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocaleChange = async (locale: Locale) => {
    await fetchTranslations(locale)
    setHtmlAttr(locale)
  }

  useEffect(() => {
    handleLocaleChange(i18n.language as Locale)
    i18n.on('languageChanged', handleLocaleChange)
    return () => {
      i18n.off('languageChanged', handleLocaleChange)
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <I18nWrapper loading={loading}>{children}</I18nWrapper>
    </I18nextProvider>
  )
}

const useCountries = () => {
  const { i18n } = useTranslation()

  const getCountryCode = (countryName: string) => {
    return countries.getAlpha2Code(countryName, i18n.language.split('-')[0])?.toLowerCase()
  }

  return { getCountryCode }
}

export { I18nProvider, useCountries }
