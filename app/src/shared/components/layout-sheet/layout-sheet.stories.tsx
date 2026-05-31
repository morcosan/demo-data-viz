import { defineMeta, loremLongText } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LayoutSheet } from './layout-sheet'

const meta: Meta = {
  title: 'Components / LayoutSheet',
  ...defineMeta(LayoutSheet, {
    slots: {
      children: loremLongText(),
    },
    props: {
      className: 'p-sm-0 max-w-xl-0',
    },
  }),
}

const Default: StoryObj<typeof LayoutSheet> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
