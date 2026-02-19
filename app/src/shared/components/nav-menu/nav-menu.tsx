'use client'

import { useTranslation } from '@app-i18n'
import { Button, DatabaseSvg, HomeSvg } from '@ds/core.ts'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { SettingsButton } from './_partials/settings-button.tsx'
import { SettingsMenu } from './_partials/settings-menu.tsx'

export interface NavMenuProps extends ReactProps {
  /** Current url pathname (same as `location.pathname`) */
  pathname: string
  /** Callback to close the menu on mobile (no effect on desktop) */
  closeMenu: () => void
  /** Flag for rendering the menu on mobile */
  mobile?: boolean
  /** Flag for rendering the menu as collapsed on desktop (no effect on mobile) */
  collapsed?: boolean
  /** Event emitted when a popup is opened or closed */
  onTogglePopup?: (opened: boolean) => void
}

/** Content to be rendered as navigation */
export const NavMenu = (props: NavMenuProps) => {
  const { t } = useTranslation()
  const [isPopupOpened, setIsPopupOpened] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  const iconWidth = 'var(--ds-spacing-sm-1)'
  const settingsMenuClass = cx(
    isPopupOpened ? 'block' : 'hidden',
    'z-popup absolute right-0 bottom-0 translate-x-full shadow-lg',
    'w-lg-7 border-color-border-shadow bg-color-bg-menu rounded-md border',
  )

  interface Item {
    path: string
    label: string
    icon: ReactNode
  }
  const items: Item[] = [
    {
      path: '/',
      label: t('appNav.label.dashboard'),
      icon: <HomeSvg className="h-xs-9" style={{ minWidth: iconWidth }} />,
    },
    {
      path: '/datasets',
      label: t('appNav.label.datasets'),
      icon: <DatabaseSvg className="h-xs-9" style={{ minWidth: iconWidth }} />,
    },
  ]

  const closeMenu = () => {
    props.closeMenu()
    togglePopup(false)
  }

  const togglePopup = (opened: boolean) => {
    setIsPopupOpened(opened)
    props.onTogglePopup?.(opened)
  }

  const handlePopupToggle = () => {
    const opened = !isPopupOpened
    togglePopup(opened)
  }

  const handleWindowClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const settings = settingsRef.current
    settings && !settings.contains(target) && togglePopup(false)
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleWindowClick)
    return () => window.removeEventListener('mousedown', handleWindowClick)
  }, [])

  return (
    <div className={cx('flex flex-1 flex-col', props.className)}>
      {props.mobile && isPopupOpened ? (
        <SettingsMenu closeMenu={closeMenu} onClickBack={handlePopupToggle} />
      ) : (
        <>
          <div className="flex flex-1 flex-col">
            {/* ITEMS */}
            {items.map((item: Item) => {
              const selected = props.pathname === item.path
              return (
                <Button
                  key={item.path}
                  linkHref={item.path}
                  variant={selected ? 'item-solid-secondary' : 'item-text-default'}
                  highlight={selected ? 'selected' : 'default'}
                  size="lg"
                  className="w-full"
                  onClick={props.closeMenu}
                >
                  {item.icon}
                  {!props.collapsed && <span className="ml-button-px-item">{item.label}</span>}
                </Button>
              )
            })}
          </div>

          {/* SETTINGS */}
          <div ref={settingsRef} className="relative">
            <SettingsButton
              iconWidth={iconWidth}
              collapsed={props.collapsed}
              highlight={isPopupOpened ? 'pressed' : 'default'}
              className="mt-xs-1"
              onClick={handlePopupToggle}
            />
            <div className={settingsMenuClass}>
              <SettingsMenu closeMenu={closeMenu} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
