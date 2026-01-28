import { IconButton, PinSvg, useViewportService } from '@ds/core.ts'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLogo } from './_app-logo.tsx'

const COOKIE_KEY = 'app-pinned-navbar'

interface Props {
	menu?: ReactNode
}

export const DesktopSidebar = (props: Props) => {
	const { t } = useTranslation()
	const [isSettingsOpened, setIsSettingsOpened] = useState(false)
	const [hasNavHover, setHasNavHover] = useState(false)
	const [hasNavFocus, setHasNavFocus] = useState(false)
	const { isViewportMinXL } = useViewportService()
	const [isNavPinned, setIsNavPinned] = useState(false)

	const loadPinConfig = () => {
		const cookie = localStorage.getItem(COOKIE_KEY)
		const isPinned = cookie === 'true' || (cookie !== 'false' && isViewportMinXL)

		localStorage.setItem(COOKIE_KEY, isPinned ? 'true' : 'false')
		setIsNavPinned(isPinned)
	}

	useEffect(() => {
		loadPinConfig()
	}, [])

	const navbarRef = useRef<HTMLDivElement>(null)
	const settingsRef = useRef<HTMLDivElement>(null)

	const isNavCollapsed = !hasNavHover && !isNavPinned

	const expandedClass = 'w-lg-7 min-w-lg-7'
	const collapsedClass = 'w-md-6 min-w-md-6'
	const sidebarClass = cx(
		'z-navbar absolute top-0 left-0 h-full',
		'transition-all duration-100 ease-in-out',
		isNavCollapsed ? collapsedClass : expandedClass,
		'px-a11y-scrollbar py-xs-3 flex flex-col',
		'border-color-border-shadow bg-color-bg-card border-r shadow-lg'
	)

	const pinColorClass = cx(isNavPinned ? 'text-color-secondary-page-text' : 'text-color-text-subtle rotate-45')

	const onClickWindow = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const settings = settingsRef.current
		const navbar = navbarRef.current

		!settings?.contains(target) && setIsSettingsOpened(false)
		!navbar?.contains(target) && setHasNavHover(false)
	}

	const onMouseDownNavOverlay = (event: ReactMouseEvent) => {
		event.stopPropagation()
		setHasNavHover(true)
		setHasNavFocus(true)
	}

	const onMouseLeaveNavbar = () => {
		!hasNavFocus && setHasNavHover(isSettingsOpened)
		setHasNavFocus(false)
	}

	useEffect(() => {
		window.addEventListener('mousedown', onClickWindow)

		return () => {
			window.removeEventListener('mousedown', onClickWindow)
		}
	}, [])

	return (
		<div className={cx('relative h-full', isNavPinned ? expandedClass : collapsedClass)}>
			{/* NAV OVERLAY */}
			<div
				className={cx('absolute-overlay z-tooltip', !isNavCollapsed && 'hidden')}
				onMouseDown={onMouseDownNavOverlay}
				onMouseEnter={() => setHasNavHover(true)}
			/>

			{/* PAGE OVERLAY */}
			<div className={isNavCollapsed || isNavPinned ? 'hidden' : 'fixed-overlay z-navbar backdrop-blur-subtle'} />

			{/* SIDEBAR */}
			<nav
				ref={navbarRef}
				aria-label={t('core.label.navigationMenu')}
				className={sidebarClass}
				onMouseLeave={onMouseLeaveNavbar}
			>
				{/* LOGO */}
				<AppLogo collapsed={isNavCollapsed} className="mb-xs-4" />

				{/* PIN */}
				<IconButton
					tooltip={isNavPinned ? 'Unpin nav menu' : 'Pin nav menu'}
					size="sm"
					className="right-xs-2 top-xs-2 absolute"
					onClick={() => setIsNavPinned(!isNavPinned)}
				>
					<PinSvg className={cx('h-xs-5', pinColorClass)} />
				</IconButton>

				{/* MENU */}
				{props.menu}
			</nav>
		</div>
	)
}
