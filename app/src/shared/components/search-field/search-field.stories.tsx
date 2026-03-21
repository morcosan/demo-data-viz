import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { SearchField } from './search-field'

const meta: Meta = {
  title: 'Components / SearchField',
  ...defineMeta(SearchField, {
    props: {
      id: 'example-id',
      value: '',
      label: 'Search label',
      className: '',
      style: {},
    },
    events: ['onChange'],
    clearDefaults: ['value', 'label'],
  }),
}

const Default: StoryObj<typeof SearchField> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
