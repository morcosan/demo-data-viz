import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { Button } from './Button.tsx'

const meta = {
	title: 'Example/Button',
	component: Button,
	argTypes: {
		backgroundColor: { control: 'color' },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Button>

export const Primary: StoryObj<typeof meta> = {
	tags: ['autodocs', 'controls'],
	args: {
		primary: true,
		label: 'Button',
	},
}
export const Secondary: StoryObj<typeof meta> = {
	tags: ['autodocs', 'controls'],
	args: {
		label: 'Button',
	},
}
export const Large: StoryObj<typeof meta> = {
	tags: ['autodocs', 'controls'],
	args: {
		size: 'large',
		label: 'Button',
	},
}
export const Small: StoryObj<typeof meta> = {
	tags: ['autodocs', 'controls'],
	args: {
		size: 'small',
		label: 'Button',
	},
}

export default meta
