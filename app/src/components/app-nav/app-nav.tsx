'use client'

import { useDefaults, useViewportService } from '@ds/core.ts'
import { type ReactNode } from 'react'
import { DesktopNav } from './_partials/desktop-nav.tsx'
import { MobileNav } from './_partials/mobile-nav.tsx'

export interface AppNavProps extends ReactProps {
	/** Content to be rendered inside the sidenav */
	/**
	 * Content to be rendered inside the sidenav
	 * @param closeMenu - Callback to close the menu on mobile (no effect on desktop)
	 */
	navContentFn: (closeMenu: () => void) => ReactNode
	/** Topbar height on mobile */
	mobileHeight?: string
	/** Sidebar width on desktop when collapsed */
	desktopMinWidth?: string
	/** Sidebar width on desktop when expanded */
	desktopMaxWidth?: string
	/** Flag that forces the sidebar to stay expanded on desktop (no effect on mobile) */
	hasActivePopup?: boolean
	/** Cookie key for storing the pinned state of the sidebar on desktop */
	cookieKeyPinned?: string
}

/** Navigation bar and menu for the entire app */
export const AppNav = (rawProps: AppNavProps) => {
	const props = useDefaults(rawProps, {
		mobileHeight: 'var(--ds-spacing-sm-6)',
		desktopMinWidth: 'var(--ds-spacing-md-6)',
		desktopMaxWidth: 'var(--ds-spacing-lg-7)',
		cookieKeyPinned: 'app-pinned-navbar',
	} as const)
	const { isViewportMaxLG } = useViewportService()

	return (
		<div
			className="flex h-full w-full flex-1 flex-col items-stretch lg:flex-row lg:pt-0!"
			style={{ paddingTop: props.mobileHeight }}
		>
			{isViewportMaxLG ? (
				<MobileNav navContentFn={props.navContentFn} mobileHeight={props.mobileHeight!} />
			) : (
				<DesktopNav
					navContentFn={props.navContentFn}
					desktopMinWidth={props.desktopMinWidth!}
					desktopMaxWidth={props.desktopMaxWidth!}
					cookieKeyPinned={props.cookieKeyPinned!}
					hasActivePopup={props.hasActivePopup}
				/>
			)}

			{/* PAGE CONTENT */}
			<main className="h-full w-full flex-1 overflow-x-hidden">{props.children}</main>
		</div>
	)
}
