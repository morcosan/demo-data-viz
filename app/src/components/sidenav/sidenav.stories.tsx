import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Sidenav } from './sidenav.tsx'

const meta: Meta<typeof Sidenav> = {
	component: Sidenav,
	title: 'Components / Sidenav',
	...createArgsConfig<typeof Sidenav>({
		args: {
			slots: {
				navContent: 'Nav Content',
				children: loremLongText(),
			},
			props: {
				hasActivePopup: false,
			},
		},
	}),
}

const Default: StoryObj<typeof Sidenav> = {
	tags: ['controls'],
}

export default meta
export { Default }
