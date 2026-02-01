import { IconButton, PinSvg } from '@ds/core.ts'
import { usePathname } from 'next/navigation'
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type AppLogo, type NavMenu } from '../types.ts'

interface Props extends ReactProps {
	appLogo: AppLogo
	navMenu: NavMenu
	desktopMinWidth: string
	desktopMaxWidth: string
	cookieKeyPinned: string
}

export const DesktopNav = (props: Props) => {
	const { t } = useTranslation()
	const pathname = usePathname()
	const [isHovered, setIsHovered] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [isPinned, setIsPinned] = useState(false)
	const [hasPopup, setHasPopup] = useState(false)
	const sidebarRef = useRef<HTMLDivElement>(null)

	const isCollapsed = !isHovered && !isPinned && !isFocused && !hasPopup

	const collapsedStyle: CSSProperties = { minWidth: props.desktopMinWidth, width: props.desktopMinWidth }
	const expandedStyle: CSSProperties = { minWidth: props.desktopMaxWidth, width: props.desktopMaxWidth }
	const sidebarStyle = isCollapsed ? collapsedStyle : expandedStyle
	const sidebarClass = cx(
		'z-navbar absolute top-0 left-0 h-full',
		'transition-all duration-100 ease-in-out',
		'p-a11y-scrollbar flex flex-col',
		'border-color-border-shadow bg-color-bg-card border-r shadow-lg'
	)
	const pinColorClass = cx(isPinned ? 'text-color-secondary-page-text' : 'text-color-text-subtle rotate-45')

	const loadPinConfig = () => {
		const cookie = localStorage.getItem(props.cookieKeyPinned)
		const isPinned = cookie === 'true' || cookie !== 'false'
		setIsPinned(isPinned)
		localStorage.setItem(props.cookieKeyPinned, isPinned ? 'true' : 'false')
	}

	const onClickPinned = (value: boolean) => {
		setIsPinned(value)
		localStorage.setItem(props.cookieKeyPinned, value ? 'true' : 'false')
	}

	const onClickWindow = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const sidebar = sidebarRef.current
		sidebar && !sidebar.contains(target) && setIsHovered(false)
	}

	// On tablet, expand sidebar on tap
	const onMouseDownOverlay = (event: ReactMouseEvent) => {
		event.stopPropagation()
		setIsHovered(true)
		setIsFocused(true)
	}

	const onMouseLeave = () => {
		!isFocused && setIsHovered(hasPopup)
		setIsFocused(false)
	}

	const onFocusInside = () => {
		setIsFocused(true)
	}

	const onBlurInside = (event: ReactFocusEvent) => {
		const target = event.relatedTarget as HTMLElement
		const sidebar = sidebarRef.current
		sidebar && !sidebar.contains(target) && setIsFocused(false)
	}

	const closeMenu = useCallback(() => {}, [])
	const onTogglePopup = useCallback((opened: boolean) => setHasPopup(opened), [])

	useEffect(() => {
		loadPinConfig()
		window.addEventListener('mousedown', onClickWindow)
		return () => window.removeEventListener('mousedown', onClickWindow)
	}, [])

	return (
		<>
			{/* PAGE OVERLAY */}
			<div
				className={cx(
					isCollapsed || isPinned || false ? 'hidden' : 'absolute-overlay z-navbar backdrop-blur-subtle',
					props.className
				)}
			/>

			{/* SIDEBAR WRAPPER */}
			<div className={cx('relative', props.className)} style={isPinned ? expandedStyle : collapsedStyle}>
				{/* FUNCTIONAL OVERLAY */}
				<div
					className={cx('absolute-overlay z-tooltip', !isCollapsed && 'hidden')}
					onMouseDown={onMouseDownOverlay}
					onMouseEnter={() => setIsHovered(true)}
				/>

				{/* SIDEBAR */}
				<nav
					ref={sidebarRef}
					aria-label={t('core.label.navigationMenu')}
					className={sidebarClass}
					style={sidebarStyle}
					onMouseLeave={onMouseLeave}
					onFocusCapture={onFocusInside}
					onBlurCapture={onBlurInside}
				>
					{/* LOGO */}
					<props.appLogo collapsed={isCollapsed} className="mb-xs-9" />

					{/* PIN */}
					<IconButton
						tooltip={isPinned ? 'Unpin nav menu' : 'Pin nav menu'}
						size="sm"
						className={cx('right-xs-2 top-xs-2 absolute!', isCollapsed && 'hidden!')}
						onClick={() => onClickPinned(!isPinned)}
					>
						<PinSvg className={cx('h-xs-5', pinColorClass)} />
					</IconButton>

					{/* MENU */}
					<props.navMenu
						pathname={pathname}
						closeMenu={closeMenu}
						collapsed={isCollapsed}
						onTogglePopup={onTogglePopup}
					/>
				</nav>
			</div>
		</>
	)
}
