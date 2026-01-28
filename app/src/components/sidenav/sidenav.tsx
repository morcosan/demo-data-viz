'use client'

import { useViewportService, wait } from '@ds/core.ts'
import { type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DesktopSidebar } from './_partials/desktop-sidebar.tsx'

interface Props extends ReactProps {
	modals: ReactNode
}

/** Sidebar with a navigation menu */
export const Sidenav = (props: Props) => {
	const { t } = useTranslation()
	const { isViewportMaxLG } = useViewportService()
	const [showsNavMenu, setShowsNavMenu] = useState(false)
	const [isMenuVisible, setIsMenuVisible] = useState(false)

	const contentClass = cx(
		'relative',
		'px-xs-8 pb-sm-5 pt-xs-7 md:px-sm-5 lg:max-w-xxl-2 lg:pb-sm-9 lg:pt-sm-3 flex flex-col lg:mx-auto'
	)

	useEffect(() => {
		showsNavMenu ? setIsMenuVisible(true) : wait(300).then(() => setIsMenuVisible(false))
	}, [showsNavMenu])

	return (
		<div
			className={cx('flex h-full w-full flex-1 items-stretch', isViewportMaxLG && 'flex-col')}
			style={{
				'--topbar-h': 'var(--ds-spacing-sm-6)',
				paddingTop: isViewportMaxLG ? 'var(--topbar-h)' : 0,
			}}
		>
			{isViewportMaxLG ? (
				<>
					{/* NAVBAR */}
					{/*<MobileTopbar hasMenu={showsNavMenu} onToggleNavMenu={onToggleNavMenu} />*/}

					{/* MENU OVERLAY */}
					<div
						className={cx('absolute-overlay backdrop-blur-subtle', !showsNavMenu && 'hidden')}
						style={{ top: 'var(--topbar-h)', zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
						onClick={() => setShowsNavMenu(false)}
					/>
					{/* MENU CONTENT */}
					<nav
						aria-label={t('core.label.navigationMenu')}
						className={cx(
							'mr-button-h-md fixed right-0 bottom-0 left-0',
							'border-color-border-shadow bg-color-bg-card border-t border-r shadow-lg',
							'transition-transform duration-300 ease-in-out',
							showsNavMenu ? 'translate-x-0' : '-translate-x-full',
							!isMenuVisible && 'invisible'
						)}
						style={{ top: 'var(--topbar-h)', zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
					>
						{/*{showsSettingsMenu ? (*/}
						{/*	<SettingsMenu onClickBack={onToggleSettings} onClickLanguage={() => setShowsI18nModal(true)} />*/}
						{/*) : (*/}
						{/*	<MobileNavMenu*/}
						{/*		unselected={blank}*/}
						{/*		onHideNavMenu={() => setShowsNavMenu(false)}*/}
						{/*		onToggleSettings={onToggleSettings}*/}
						{/*	/>*/}
						{/*)}*/}
					</nav>
				</>
			) : (
				<DesktopSidebar />
			)}

			{/* PAGE CONTENT */}
			<main className="h-full w-full flex-1 overflow-x-hidden">
				<div className={contentClass}>{props.children}</div>

				{/* MODALS */}
				{props.modals}
			</main>
		</div>
	)
}
