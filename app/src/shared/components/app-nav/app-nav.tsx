'use client'

import { ErrorBoundary } from '@app-components'
import { useDefaults } from '@ds/core.ts'
import { DesktopNav } from './_partials/desktop-nav.tsx'
import { MobileNav } from './_partials/mobile-nav.tsx'
import { type AppLogo, type NavMenu } from './types.ts'

export interface AppNavProps extends ReactProps {
	/** App logo to be rendered on top of navigation */
	appLogo: AppLogo
	/** Content to be rendered as navigation */
	navMenu: NavMenu
	/** Topbar height on mobile */
	mobileHeight?: string
	/** Sidebar width on desktop when collapsed */
	desktopMinWidth?: string
	/** Sidebar width on desktop when expanded */
	desktopMaxWidth?: string
	/** Cookie key for storing the pinned state of the sidebar on desktop */
	cookieKeyPinned?: string
}

/** Navigation bar and menu for the entire app */
export const AppNav = (rawProps: AppNavProps) => {
	const props = useDefaults(rawProps, {
		mobileHeight: 'var(--ds-spacing-sm-6)',
		desktopMinWidth: 'var(--ds-spacing-md-2)',
		desktopMaxWidth: 'var(--ds-spacing-lg-5)',
		cookieKeyPinned: 'app-pinned-navbar',
	} as const)

	return (
		<div
			className="flex h-full w-full flex-1 flex-col items-stretch lg:flex-row lg:pt-0!"
			style={{ paddingTop: props.mobileHeight }}
		>
			<ErrorBoundary className="max-h-md-0 lg:max-h-unset lg:max-w-lg-9">
				{/* NAVIGATION */}
				<MobileNav
					className="lg:hidden"
					appLogo={props.appLogo}
					navMenu={props.navMenu}
					mobileHeight={props.mobileHeight!}
				/>
				<DesktopNav
					className="hidden lg:block"
					appLogo={props.appLogo}
					navMenu={props.navMenu}
					desktopMinWidth={props.desktopMinWidth!}
					desktopMaxWidth={props.desktopMaxWidth!}
					cookieKeyPinned={props.cookieKeyPinned!}
				/>
			</ErrorBoundary>

			{/* PAGE CONTENT */}
			<main className="h-full w-full flex-1 overflow-x-hidden">{props.children}</main>
		</div>
	)
}
