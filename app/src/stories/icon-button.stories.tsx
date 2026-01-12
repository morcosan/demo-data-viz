import { IconButton } from '@ds/core.ts'
import { createArgsConfig } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof IconButton> = {
	component: IconButton,
	title: 'Test / Icon Button',
	...createArgsConfig<typeof IconButton>({
		args: {
			slots: {
				children: '⭐',
				tooltip: 'Tooltip',
				ariaDescription: 'Example description',
			},
			props: {
				size: 'md',
				variant: 'text-default',
				pressed: false,
				loading: false,
				disabled: false,
				linkHref: '',
				linkType: 'internal',
				className: '',
			},
			events: ['onClick'],
		},
		inlineRadios: ['size', 'variant', 'linkType'],
	}),
}

const Default: StoryObj<typeof IconButton> = {
	tags: ['controls'],
}

export default meta
export { Default }
