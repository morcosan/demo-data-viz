import { useTranslation } from '@app-i18n'
import { IconButton, PinSvg } from '@ds/core'
import { usePathname } from 'next/navigation'
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { type AppLogo, type NavMenu } from '../types'

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
    'border-color-border-shadow bg-color-bg-pane border-r shadow-lg',
  )
  const pinColorClass = cx(isPinned ? 'text-color-secondary-page-text' : 'text-color-text-subtle rotate-45')

  const loadPinConfig = () => {
    const cookie = localStorage.getItem(props.cookieKeyPinned)
    const isPinned = cookie === 'true' || cookie !== 'false' // Start with sidebar as pinned
    setIsPinned(isPinned)
    localStorage.setItem(props.cookieKeyPinned, isPinned ? 'true' : 'false')
  }

  const handlePinClick = (value: boolean) => {
    setIsPinned(value)
    localStorage.setItem(props.cookieKeyPinned, value ? 'true' : 'false')
  }

  const handleWindowClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const sidebar = sidebarRef.current
    sidebar && !sidebar.contains(target) && setIsHovered(false)
  }

  // On tablet, expand sidebar on tap
  const handleOverlayMouseDown = (event: ReactMouseEvent) => {
    event.stopPropagation()
    setIsHovered(true)
    setIsFocused(true)
  }

  const handleMouseLeave = () => {
    !isFocused && setIsHovered(hasPopup)
    setIsFocused(false)
  }

  const handleFocusInside = () => {
    setIsFocused(true)
  }

  const handleBlurInside = (event: ReactFocusEvent) => {
    const target = event.relatedTarget as HTMLElement
    const sidebar = sidebarRef.current
    sidebar && !sidebar.contains(target) && setIsFocused(false)
  }

  const closeMenu = useCallback(() => {}, [])
  const handlePopupToggle = useCallback((opened: boolean) => setHasPopup(opened), [])

  useEffect(() => {
    loadPinConfig()
    window.addEventListener('mousedown', handleWindowClick)
    return () => window.removeEventListener('mousedown', handleWindowClick)
  }, [])

  return (
    <>
      {/* PAGE OVERLAY */}
      <div
        className={cx(
          isCollapsed || isPinned || false ? 'hidden' : 'absolute-overlay z-navbar backdrop-blur-subtle',
          props.className,
        )}
      />

      {/* SIDEBAR WRAPPER */}
      <div className={cx('relative', props.className)} style={isPinned ? expandedStyle : collapsedStyle}>
        {/* FUNCTIONAL OVERLAY */}
        <div
          className={cx('absolute-overlay z-tooltip', !isCollapsed && 'hidden')}
          onMouseDown={handleOverlayMouseDown}
          onMouseEnter={() => setIsHovered(true)}
        />

        {/* SIDEBAR */}
        <nav
          ref={sidebarRef}
          aria-label={t('core.label.navigationMenu')}
          className={sidebarClass}
          style={sidebarStyle}
          onMouseLeave={handleMouseLeave}
          onFocusCapture={handleFocusInside}
          onBlurCapture={handleBlurInside}
        >
          {/* LOGO */}
          <props.appLogo collapsed={isCollapsed} className="mb-xs-9" />

          {/* PIN */}
          <IconButton
            tooltip={isPinned ? t('core.action.unpinNavMenu') : t('core.action.pinNavMenu')}
            size="sm"
            className={cx('right-xs-2 top-xs-2 absolute!', isCollapsed && 'hidden!')}
            onClick={() => handlePinClick(!isPinned)}
          >
            <PinSvg className={cx('h-xs-5', pinColorClass)} />
          </IconButton>

          {/* MENU */}
          <props.navMenu
            pathname={pathname}
            closeMenu={closeMenu}
            collapsed={isCollapsed}
            onTogglePopup={handlePopupToggle}
          />
        </nav>
      </div>
    </>
  )
}
