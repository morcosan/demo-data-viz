'use client'

import { QueryProvider } from '@app-api'
import { I18nProvider, initClientI18n } from '@app-i18n'
import { ENV__BUILD_NUMBER } from '@app/env'
import '@app/globals'
import { LOG } from '@app/shared/utils/js-utils'
import '@app/styling/index'
import { A11yService, ConfigService, HocComposer, ThemeService, ViewportService } from '@ds/core'
import { StrictMode } from 'react'
import { RouterProvider } from './router/router-provider'

if (typeof window !== 'undefined') {
  LOG('BUILD_NUMBER:', ENV__BUILD_NUMBER)
}

initClientI18n()

const hoc = HocComposer.hoc
const providers = [
  hoc(StrictMode, {}),
  hoc(ConfigService, {}),
  hoc(A11yService, {}),
  hoc(ViewportService, {}),
  hoc(I18nProvider, {}),
  hoc(QueryProvider, {}),
  hoc(RouterProvider, {}),
  hoc(ThemeService, { cookieKey: 'app-color-theme' }),
]

export const Providers = ({ children }: ReactProps) => {
  return <HocComposer hocs={providers}>{children}</HocComposer>
}
