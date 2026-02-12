import { defineMeta } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { HighlightedText } from './highlighted-text.tsx'

const meta: Meta = {
	title: 'Components / HighlightedText',
	...defineMeta(HighlightedText, {
		props: {
			text: 'Lorem ipsum dolor sit amet\nConsectetur adipiscing elit\nLorem ipsum dolor sit amet',
			keyword: 'ipsum dolor',
			className: '',
		},
	}),
}

const Default: StoryObj<typeof HighlightedText> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
