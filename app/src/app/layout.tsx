import { AppLogo, AppNav, ErrorBoundary, NavMenu } from '@app-components'
import { DEFAULT_LOCALE } from '@app/core/i18n/i18n-config'
import { Providers } from '@app/core/providers'
import '@app/globals'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo Data Viz',
  description: 'Demo project for data viz dashboards',
}

export default function RootLayout({ children }: ReactProps) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="h-screen">
        <Providers>
          <AppNav appLogo={AppLogo} navMenu={NavMenu}>
            <ErrorBoundary>
              <div className={cx('relative flex h-full w-full', 'px-xs-5 py-xs-5 lg:pt-xs-7 lg:px-sm-0')}>
                {children}
              </div>
            </ErrorBoundary>
          </AppNav>
        </Providers>
      </body>
    </html>
  )
}
