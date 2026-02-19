import { defineMeta, loremLongText } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LayoutPane } from './layout-pane'

const meta: Meta = {
  title: 'Components / LayoutPane',
  ...defineMeta(LayoutPane, {
    slots: {
      children: loremLongText(),
    },
    props: {
      className: 'p-sm-0 max-w-xl-0',
    },
  }),
}

const Default: StoryObj<typeof LayoutPane> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
