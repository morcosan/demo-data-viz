import { IconButton, MenuSvg, wait } from '@ds/core.ts'
import { type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLogo } from './_app-logo.tsx'

interface Props {
	navContent: ReactNode
}

export const MobileNav = (props: Props) => {
	const { t } = useTranslation()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMenuVisible, setIsMenuVisible] = useState(false)

	useEffect(() => {
		// Hide menu after animation ends
		isMenuOpen ? setIsMenuVisible(true) : wait(300).then(() => setIsMenuVisible(false))
	}, [isMenuOpen])

	return (
		<>
			{/* PAGE OVERLAY */}
			<div
				className={cx('absolute-overlay backdrop-blur-subtle', !isMenuOpen && 'hidden')}
				style={{ top: 'var(--topbar-h)', zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
				onClick={() => setIsMenuOpen(false)}
			/>

			{/* TOPBAR */}
			<nav
				aria-label={t('core.label.navigationBar')}
				className="z-navbar border-color-border-shadow absolute top-0 left-0 w-full border-t shadow-sm"
				style={{ minHeight: 'var(--topbar-h)', height: 'var(--topbar-h)' }}
			>
				<div className="bg-color-bg-card px-xs-2 flex h-full items-center">
					{/* MENU BUTTON */}
					<IconButton
						tooltip={t('core.action.openMenu')}
						pressed={isMenuOpen}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<MenuSvg className="h-xs-9" />
					</IconButton>

					{/* LOGO */}
					<AppLogo className="ml-xs-3" mobile />
				</div>
			</nav>

			{/* MENU */}
			<nav
				aria-label={t('core.label.navigationMenu')}
				className={cx(
					'mr-button-h-md absolute right-0 bottom-0 left-0',
					'border-color-border-shadow bg-color-bg-card border-t border-r shadow-lg',
					'transition-transform duration-300 ease-in-out',
					isMenuOpen ? 'translate-x-0' : '-translate-x-full',
					!isMenuVisible && 'invisible'
				)}
				style={{ top: 'var(--topbar-h)', zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
			>
				<div className="px-a11y-scrollbar py-scrollbar-w pt-xs-9 flex h-full w-full flex-col">
					{props.navContent}
				</div>
			</nav>
		</>
	)
}
