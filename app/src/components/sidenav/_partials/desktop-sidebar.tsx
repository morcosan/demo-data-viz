import { IconButton, PinSvg, useViewportService } from '@ds/core.ts'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLogo } from './_app-logo.tsx'

const COOKIE_KEY = 'app-pinned-navbar'

interface Props {
	navContent: ReactNode
	hasActivePopup?: boolean
}

export const DesktopSidebar = (props: Props) => {
	const { t } = useTranslation()
	const { isViewportMinXL } = useViewportService()
	const [isHovered, setIsHovered] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [isPinned, setIsPinned] = useState(false)
	const contentRef = useRef<HTMLDivElement>(null)
	const isCollapsed = !isHovered && !isPinned && !isFocused && !props.hasActivePopup

	const expandedClass = 'w-lg-7 min-w-lg-7'
	const collapsedClass = 'w-md-6 min-w-md-6'
	const sidebarClass = cx(
		'z-navbar absolute top-0 left-0 h-full',
		'transition-all duration-100 ease-in-out',
		isCollapsed ? collapsedClass : expandedClass,
		'px-a11y-scrollbar py-xs-3 flex flex-col',
		'border-color-border-shadow bg-color-bg-card border-r shadow-lg'
	)

	const pinColorClass = cx(isPinned ? 'text-color-secondary-page-text' : 'text-color-text-subtle rotate-45')

	const loadPinConfig = () => {
		const cookie = localStorage.getItem(COOKIE_KEY)
		const isPinned = cookie === 'true' || (cookie !== 'false' && isViewportMinXL)
		setIsPinned(isPinned)
		localStorage.setItem(COOKIE_KEY, isPinned ? 'true' : 'false')
	}

	const onClickPinned = (value: boolean) => {
		setIsPinned(value)
		localStorage.setItem(COOKIE_KEY, value ? 'true' : 'false')
	}

	const onClickWindow = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const content = contentRef.current
		content && !content.contains(target) && setIsHovered(false)
	}

	const onMouseDownOverlay = (event: ReactMouseEvent) => {
		event.stopPropagation()
		setIsHovered(true)
		setIsFocused(true)
	}

	const onMouseLeaveContent = () => {
		!isFocused && setIsHovered(Boolean(props.hasActivePopup))
		setIsFocused(false)
	}

	const onFocusCapture = () => {
		setIsFocused(true)
	}

	const onBlurCapture = (event: ReactFocusEvent) => {
		const target = event.relatedTarget as HTMLElement
		const content = contentRef.current
		content && !content.contains(target) && setIsFocused(false)
	}

	useEffect(() => {
		loadPinConfig()
		window.addEventListener('mousedown', onClickWindow)

		return () => {
			window.removeEventListener('mousedown', onClickWindow)
		}
	}, [])

	return (
		<div className={cx('relative', isPinned ? expandedClass : collapsedClass)}>
			{/* FUNCTIONAL OVERLAY */}
			<div
				className={cx('absolute-overlay z-tooltip', !isCollapsed && 'hidden')}
				onMouseDown={onMouseDownOverlay}
				onMouseEnter={() => setIsHovered(true)}
			/>

			{/* PAGE OVERLAY */}
			<div className={isCollapsed || isPinned ? 'hidden' : 'fixed-overlay z-navbar backdrop-blur-subtle'} />

			{/* CONTENT */}
			<nav
				ref={contentRef}
				aria-label={t('core.label.navigationMenu')}
				className={sidebarClass}
				onMouseLeave={onMouseLeaveContent}
				onFocusCapture={onFocusCapture}
				onBlurCapture={onBlurCapture}
			>
				{/* LOGO */}
				<AppLogo collapsed={isCollapsed} className="mb-xs-4" />

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
				{props.navContent}
			</nav>
		</div>
	)
}
