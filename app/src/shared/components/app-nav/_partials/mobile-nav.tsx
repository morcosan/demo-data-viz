import { useTranslation } from '@app-i18n'
import { IconButton, MenuSvg, wait } from '@ds/core'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { type AppLogoType, type NavMenuType } from '../types'

interface Props {
  appLogo: AppLogoType
  navMenu: NavMenuType
  mobileHeight: string
}

export const MobileNav = (props: Props) => {
  const { appLogo: AppLogo, navMenu: NavMenu, mobileHeight } = props
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useEffect(() => {
    // Hide menu after animation ends
    isMenuOpen ? setIsMenuVisible(true) : wait(300).then(() => setIsMenuVisible(false))
  }, [isMenuOpen])

  return (
    <>
      {/* PAGE OVERLAY */}
      <div
        className={cx('absolute-overlay backdrop-blur-subtle', !isMenuOpen && 'hidden')}
        style={{ top: mobileHeight, zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* TOPBAR */}
      <nav
        aria-label={t('core.label.navigationBar')}
        className="z-navbar border-color-border-shadow absolute top-0 left-0 w-full border-t shadow-sm"
        style={{ minHeight: mobileHeight, height: mobileHeight }}
      >
        <div className="bg-color-bg-card px-xs-2 flex h-full items-center">
          {/* MENU BUTTON */}
          <IconButton
            tooltip={isMenuOpen ? t('core.action.closeMenu') : t('core.action.openMenu')}
            pressed={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuSvg className="h-xs-9" />
          </IconButton>

          {/* LOGO */}
          <AppLogo mobile className="ml-xs-3" />
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
          !isMenuVisible && 'invisible',
        )}
        style={{ top: mobileHeight, zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
      >
        <div className="p-a11y-scrollbar flex h-full w-full flex-col">
          <NavMenu mobile pathname={pathname} closeMenuFn={closeMenu} />
        </div>
      </nav>
    </>
  )
}
