'use client'

import { useViewportService } from '@ds/core.ts'
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
	/** Flag that forces the sidebar to stay expanded on desktop (no effect on mobile) */
	hasActivePopup?: boolean
}

/** Sidebar with a navigation menu */
export const AppNav = (props: AppNavProps) => {
	const { isViewportMaxLG } = useViewportService()

	return (
		<div
			className={cx('flex h-full w-full flex-1 items-stretch', isViewportMaxLG && 'flex-col')}
			style={{
				'--topbar-h': 'var(--ds-spacing-sm-6)',
				paddingTop: isViewportMaxLG ? 'var(--topbar-h)' : 0,
			}}
		>
			{isViewportMaxLG ? (
				<MobileNav navContentFn={props.navContentFn} />
			) : (
				<DesktopNav navContentFn={props.navContentFn} hasActivePopup={props.hasActivePopup} />
			)}

			{/* PAGE CONTENT */}
			<main className="h-full w-full flex-1 overflow-x-hidden">{props.children}</main>
		</div>
	)
}
