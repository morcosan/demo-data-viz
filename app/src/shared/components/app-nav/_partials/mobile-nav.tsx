import { useTranslation } from '@app-i18n'
import { IconButton, MenuSvg, wait } from '@ds/core'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { type AppLogo, type NavMenu } from '../types'

interface Props extends ReactProps {
  appLogo: AppLogo
  navMenu: NavMenu
  mobileHeight: string
}

export const MobileNav = (props: Props) => {
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
        className={cx('absolute-overlay backdrop-blur-subtle', !isMenuOpen && 'hidden', props.className)}
        style={{ top: props.mobileHeight, zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* TOPBAR */}
      <nav
        aria-label={t('core.label.navigationBar')}
        className={cx(
          'z-navbar border-color-border-shadow absolute top-0 left-0 w-full border-t shadow-sm',
          props.className,
        )}
        style={{ minHeight: props.mobileHeight, height: props.mobileHeight }}
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
          <props.appLogo mobile className="ml-xs-3" />
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
          props.className,
        )}
        style={{ top: props.mobileHeight, zIndex: 'calc(var(--ds-z-index-navbar) - 1)' }}
      >
        <div className="p-a11y-scrollbar flex h-full w-full flex-col">
          <props.navMenu mobile pathname={pathname} closeMenu={closeMenu} />
        </div>
      </nav>
    </>
  )
}
