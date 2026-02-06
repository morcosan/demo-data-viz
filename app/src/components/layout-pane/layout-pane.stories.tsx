import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LayoutPane } from './layout-pane.tsx'

const meta: Meta<typeof LayoutPane> = {
	component: LayoutPane,
	title: 'Components / LayoutPane',
	...createArgsConfig<typeof LayoutPane>({
		args: {
			slots: {
				children: loremLongText(),
			},
			props: {
				className: 'p-sm-0 max-w-xl-0',
			},
		},
	}),
}

const Default: StoryObj<typeof LayoutPane> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
