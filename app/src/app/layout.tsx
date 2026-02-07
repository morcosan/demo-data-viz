import { type Metadata } from 'next'
import { AppLogo } from '../components/app-logo/app-logo.tsx'
import { AppNav } from '../components/app-nav/app-nav.tsx'
import { NavMenu } from '../components/nav-menu/nav-menu.tsx'
import '../env.server.ts'
import { DEFAULT_LOCALE } from '../i18n/i18n-config.ts'
import '../styling/index.ts'
import { Providers } from './_setup/providers.tsx'

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
						<div className="px-xs-5 pt-xs-5 lg:pt-xs-7 pb-xs-5 lg:pb-sm-0 lg:px-sm-0 relative flex h-full w-full">
							{children}
						</div>
					</AppNav>
				</Providers>
			</body>
		</html>
	)
}
