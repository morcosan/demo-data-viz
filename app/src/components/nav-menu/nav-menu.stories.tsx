import { createArgsConfig } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { NavMenu } from './nav-menu.tsx'

const meta: Meta<typeof NavMenu> = {
	component: NavMenu,
	title: 'Components / NavMenu',
	...createArgsConfig<typeof NavMenu>({
		args: {
			props: {
				closeMenu: () => {},
				collapsed: false,
				className: '',
			},
			events: ['onTogglePopup'],
		},
	}),
}

const Default: StoryObj<typeof NavMenu> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
