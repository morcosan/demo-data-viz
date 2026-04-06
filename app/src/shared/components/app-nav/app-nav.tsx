'use client'

import { useViewportService } from '@ds/core'
import { ErrorBoundary } from '../error-boundary/error-boundary'
import { DesktopNav } from './_partials/desktop-nav'
import { MobileNav } from './_partials/mobile-nav'
import { type AppLogoType, type NavMenuType } from './types'

export interface AppNavProps extends ReactProps {
  /** App logo to be rendered on top of navigation */
  appLogo: AppLogoType
  /** Content to be rendered as navigation */
  navMenu: NavMenuType
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
export const AppNav = (props: AppNavProps) => {
  const { isViewportMaxLG } = useViewportService()
  const {
    appLogo: AppLogo,
    navMenu: NavMenu,
    children,
    cookieKeyPinned = 'app-pinned-navbar',
    desktopMaxWidth = 'var(--ds-spacing-lg-5)',
    desktopMinWidth = 'var(--ds-spacing-md-2)',
    mobileHeight = 'var(--ds-spacing-sm-6)',
  } = props

  return (
    <div
      className="flex h-full w-full flex-1 flex-col items-stretch lg:flex-row lg:pt-0!"
      style={{ paddingTop: mobileHeight }}
    >
      <ErrorBoundary>
        {/* NAVIGATION */}
        {isViewportMaxLG ? (
          <MobileNav appLogo={AppLogo} navMenu={NavMenu} mobileHeight={mobileHeight} />
        ) : (
          <DesktopNav
            appLogo={AppLogo}
            navMenu={NavMenu}
            desktopMinWidth={desktopMinWidth}
            desktopMaxWidth={desktopMaxWidth}
            cookieKeyPinned={cookieKeyPinned}
          />
        )}
      </ErrorBoundary>

      {/* PAGE CONTENT */}
      <main className="h-full w-full flex-1 overflow-x-hidden">{children}</main>
    </div>
  )
}
