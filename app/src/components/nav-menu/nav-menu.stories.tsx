import { createArgsConfig } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useMemo, useState } from 'react'
import { NavMenu, type NavMenuProps } from './nav-menu.tsx'

const meta: Meta<typeof NavMenu> = {
	component: NavMenu,
	title: 'Components / NavMenu',
	...createArgsConfig<typeof NavMenu>({
		args: {
			props: {
				location: window.location,
				closeMenu: () => {},
				collapsed: false,
				className: 'bg-color-bg-card',
			},
			events: ['onTogglePopup'],
		},
	}),
	render: function Story(props: NavMenuProps) {
		const [currentPath, setCurrentPath] = useState('/')

		const location = useMemo(() => ({ ...window.location, pathname: currentPath }), [currentPath])

		const handleNavigate = (event: CustomEvent) => setCurrentPath(event.detail[0])

		useEffect(() => {
			window.addEventListener('sb:navigate' as any, handleNavigate)
			return () => window.removeEventListener('sb:navigate' as any, handleNavigate)
		}, [])

		return <NavMenu {...props} location={location} />
	},
}

const Default: StoryObj<typeof NavMenu> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
