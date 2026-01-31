import { createArgsConfig, useLocationMock } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { NavMenu, type NavMenuProps } from './nav-menu.tsx'

const meta: Meta<typeof NavMenu> = {
	component: NavMenu,
	title: 'Components / NavMenu',
	...createArgsConfig<typeof NavMenu>({
		args: {
			props: {
				location: null,
				closeMenu: () => {},
				collapsed: false,
				className: 'bg-color-bg-card',
			},
			events: ['onTogglePopup'],
		},
	}),
	render: function Story(props: NavMenuProps) {
		const { location } = useLocationMock()

		return <NavMenu {...props} location={location} />
	},
}

const Default: StoryObj<typeof NavMenu> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
