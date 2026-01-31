'use client'

import { Button, DatabaseSvg, HomeSvg } from '@ds/core.ts'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsButton } from './_partials/settings-button.tsx'
import { SettingsMenu } from './_partials/settings-menu.tsx'

export interface NavMenuProps extends ReactProps {
	/** Window location object */
	location: Location
	/** Callback to close the menu on mobile (no effect on desktop) */
	closeMenu: () => void
	/** Flag for rendering the menu as collapsed on desktop (no effect on mobile) */
	collapsed?: boolean
	/** Event emitted when a popup is opened or closed */
	onTogglePopup?: (opened: boolean) => void
}

/** Content to be rendered as navigation */
export const NavMenu = (props: NavMenuProps) => {
	const { t } = useTranslation()
	const [isSettingsOpened, setIsSettingsOpened] = useState(false)
	const settingsRef = useRef<HTMLDivElement>(null)

	const iconWidth = 'var(--ds-spacing-sm-1)'
	const settingsMenuClass = cx(
		isSettingsOpened ? 'block' : 'hidden',
		'z-popup absolute right-0 bottom-0 translate-x-full shadow-lg',
		'w-lg-7 border-color-border-shadow bg-color-bg-popup rounded-md border'
	)

	interface Item {
		path: string
		label: string
		icon: ReactNode
	}
	const items: Item[] = [
		{
			path: '/',
			label: t('core.menuLabel.dashboard'),
			icon: <HomeSvg className="h-xs-9" style={{ minWidth: iconWidth }} />,
		},
		{
			path: '/datasets',
			label: t('core.menuLabel.datasets'),
			icon: <DatabaseSvg className="h-xs-9" style={{ minWidth: iconWidth }} />,
		},
	]

	const toggleSettings = (opened: boolean) => {
		setIsSettingsOpened(opened)
		props.onTogglePopup?.(opened)
	}

	const onToggleSettings = () => {
		const opened = !isSettingsOpened
		toggleSettings(opened)
	}

	const onClickWindow = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const settings = settingsRef.current
		settings && !settings.contains(target) && toggleSettings(false)
	}

	useEffect(() => {
		window.addEventListener('mousedown', onClickWindow)
		return () => window.removeEventListener('mousedown', onClickWindow)
	}, [])

	return (
		<div className={cx('flex flex-1 flex-col', props.className)}>
			<div className="flex flex-1 flex-col">
				{/* ITEMS */}
				{items.map((item: Item) => {
					const selected = props.location.pathname === item.path
					return (
						<Button
							key={item.path}
							linkHref={item.path}
							variant={selected ? 'item-solid-secondary' : 'item-text-default'}
							highlight={selected ? 'selected' : 'default'}
							size="lg"
							className="w-full"
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
					highlight={isSettingsOpened ? 'pressed' : 'default'}
					className="mt-xs-1"
					onClick={onToggleSettings}
				/>
				<div className={settingsMenuClass}>
					<SettingsMenu />
				</div>
			</div>
		</div>
	)
}
