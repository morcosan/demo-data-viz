'use client'

import { useEffect, useRef, useState } from 'react'
import { SettingsButton } from './_partials/settings-button.tsx'
import { SettingsMenu } from './_partials/settings-menu.tsx'

export interface NavMenuProps extends ReactProps {
	/** Callback to close the menu on mobile (no effect on desktop) */
	closeMenu: () => void
}

/** Content to be rendered as navigation */
export const NavMenu = (props: NavMenuProps) => {
	const [isSettingsOpened, setIsSettingsOpened] = useState(false)
	const settingsRef = useRef<HTMLDivElement>(null)

	const settingsMenuClass = cx(
		isSettingsOpened ? 'block' : 'hidden',
		'z-popup absolute right-0 bottom-0 translate-x-full shadow-lg',
		'w-lg-7 border-color-border-shadow bg-color-bg-popup rounded-md border'
	)

	const onToggleSettings = () => {
		const opened = !isSettingsOpened
		// !opened && setHasNavHover(false) TODO
		setIsSettingsOpened(opened)
	}

	const onClickWindow = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		const settings = settingsRef.current
		settings && !settings.contains(target) && setIsSettingsOpened(false)
	}

	useEffect(() => {
		window.addEventListener('mousedown', onClickWindow)
		return () => window.removeEventListener('mousedown', onClickWindow)
	}, [])

	return (
		<div className={cx('flex flex-1 flex-col', props.className)}>
			<div className="flex-1">menu</div>

			{/* SETTINGS */}
			<div ref={settingsRef} className="relative">
				<SettingsButton highlight={isSettingsOpened ? 'pressed' : 'default'} onClick={onToggleSettings} />
				<div className={settingsMenuClass}>
					<SettingsMenu />
				</div>
			</div>
		</div>
	)
}
