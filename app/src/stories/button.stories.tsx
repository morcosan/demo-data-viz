import { Button } from '@ds/core.ts'
import { createArgsConfig } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'Test / Button',
	...createArgsConfig<typeof Button>({
		args: {
			slots: {
				children: 'Test qyp',
				tooltip: 'Tooltip',
				ariaDescription: 'Example description',
			},
			props: {
				size: 'md',
				variant: 'solid-primary',
				highlight: 'default',
				loading: false,
				disabled: false,
				linkHref: '',
				linkType: 'internal',
				className: '',
			},
			events: ['onClick'],
		},
		inlineRadios: ['size', 'variant', 'highlight', 'linkType'],
	}),
}

const Default: StoryObj<typeof Button> = {
	tags: ['controls'],
}

export default meta
export { Default }
