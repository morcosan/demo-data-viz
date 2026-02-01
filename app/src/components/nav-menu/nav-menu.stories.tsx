import { createArgsConfig, useLocationMock } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { NavMenu, type NavMenuProps } from './nav-menu.tsx'

const meta: Meta<typeof NavMenu> = {
	component: NavMenu,
	title: 'Components / NavMenu',
	...createArgsConfig<typeof NavMenu>({
		args: {
			props: {
				pathname: '',
				closeMenu: () => {},
				mobile: false,
				collapsed: false,
				className: 'w-lg-7 bg-color-bg-card',
			},
			events: ['onTogglePopup'],
		},
	}),
	render: function Story(props: NavMenuProps) {
		const { location } = useLocationMock()

		return <NavMenu {...props} pathname={props.pathname || location.pathname} />
	},
}

const Default: StoryObj<typeof NavMenu> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
