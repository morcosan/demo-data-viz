import { AppLogo, AppNav, ErrorBoundary, NavMenu } from '@app-components'
import { DEFAULT_LOCALE } from '@app/core/i18n/i18n-config.ts'
import { Providers } from '@app/core/providers.tsx'
import '@app/globals.ts'
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
							<div className="px-xs-5 pt-xs-5 lg:pt-xs-7 pb-xs-5 lg:pb-sm-0 lg:px-sm-0 relative flex h-full w-full">
								{children}
							</div>
						</ErrorBoundary>
					</AppNav>
				</Providers>
			</body>
		</html>
	)
}
