import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { SideNav } from './side-nav.tsx'

const meta: Meta<typeof SideNav> = {
	component: SideNav,
	title: 'Components / SideNav',
	...createArgsConfig<typeof SideNav>({
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

const Default: StoryObj<typeof SideNav> = {
	tags: ['controls'],
}

export default meta
export { Default }
