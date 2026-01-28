'use client'

import { useViewportService } from '@ds/core.ts'
import { type ReactNode } from 'react'
import { DesktopNav } from './_partials/desktop-nav.tsx'
import { MobileNav } from './_partials/mobile-nav.tsx'

interface Props extends ReactProps {
	navContent: ReactNode
	hasActivePopup?: boolean
}

/** Sidebar with a navigation menu */
export const SideNav = (props: Props) => {
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
				<MobileNav navContent={props.navContent} />
			) : (
				<DesktopNav navContent={props.navContent} hasActivePopup={props.hasActivePopup} />
			)}

			{/* PAGE CONTENT */}
			<main className="h-full w-full flex-1 overflow-x-hidden">{props.children}</main>
		</div>
	)
}
