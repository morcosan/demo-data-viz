import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { EmptyState } from './empty-state'

const meta: Meta = {
  title: 'Components / EmptyState',
  ...defineMeta(EmptyState, {
    slots: {
      children: 'Select an item!',
    },
    props: {
      variant: 'default',
      className: '',
    },
    inlineRadios: ['variant'],
  }),
}

const Default: StoryObj<typeof EmptyState> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
