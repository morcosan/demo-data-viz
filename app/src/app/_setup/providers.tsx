'use client'

import { A11yService, ConfigService, HocComposer, ThemeService, ViewportService } from '@ds/core.ts'
import { StrictMode } from 'react'
import '../../env.client.ts'
import { initClientI18n } from '../../i18n/i18n-client.ts'
import { I18nProvider } from '../../i18n/i18n-provider.tsx'
import { RouterProvider } from './router-provider.tsx'

initClientI18n()

const hoc = HocComposer.hoc
const providers = [
	hoc(StrictMode, {}),
	hoc(ConfigService, {}),
	hoc(A11yService, {}),
	hoc(ViewportService, {}),
	hoc(I18nProvider, {}),
	hoc(RouterProvider, {}),
	hoc(ThemeService, { cookieKey: 'app-color-theme' }),
]

export const Providers = ({ children }: ReactProps) => {
	return <HocComposer hocs={providers}>{children}</HocComposer>
}
