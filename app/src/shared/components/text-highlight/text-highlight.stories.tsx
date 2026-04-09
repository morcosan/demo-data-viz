import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { TextHighlight } from './text-highlight'

const meta: Meta = {
  title: 'Components / TextHighlight',
  ...defineMeta(TextHighlight, {
    props: {
      text: 'Lorem ipsum dolor sit amet\nConsectetur adipiscing elit\nLorem ipsum dolor sit amet',
      md: 'ipsum dolor',
      className: '',
    },
    clearDefaults: ['text', 'query'],
  }),
}

const Default: StoryObj<typeof TextHighlight> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
