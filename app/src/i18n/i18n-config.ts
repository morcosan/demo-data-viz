import type { InitOptions } from 'i18next'

type Locale = 'en-US'
type LocaleInfo = {
	countryCode: string
	nativeName: string
	englishName: string
}

const LOCALE_INFO: Record<Locale, LocaleInfo> = {
	'en-US': { countryCode: 'us', nativeName: 'English', englishName: 'English' },
}
const DEFAULT_LOCALE = 'en-US'
const I18N_NAMESPACE = 'translation'

const i18nConfig: InitOptions = {
	// Dynamic loading
	resources: {},
	load: 'currentOnly',
	react: {
		useSuspense: false,
		bindI18nStore: 'added', // Trigger rerendering after loading translations
	},

	// Languages
	supportedLngs: Object.keys(LOCALE_INFO),
	fallbackLng: DEFAULT_LOCALE,
	ns: [I18N_NAMESPACE],

	// Translation value
	interpolation: {
		escapeValue: false, // React already escapes by default
		prefix: '{',
		suffix: '}',
	},
}

export { DEFAULT_LOCALE, I18N_NAMESPACE, i18nConfig, LOCALE_INFO, type Locale, type LocaleInfo }
