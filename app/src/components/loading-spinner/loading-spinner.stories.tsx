import { createArgsConfig } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LoadingSpinner } from './loading-spinner.tsx'

const meta: Meta<typeof LoadingSpinner> = {
	component: LoadingSpinner,
	title: 'Components / LoadingSpinner',
	...createArgsConfig<typeof LoadingSpinner>({
		args: {
			props: {
				size: 'sm',
				className: '',
			},
		},
	}),
}

const Default: StoryObj<typeof LoadingSpinner> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
