import { defineMeta, loremArray, loremFalse, loremFullName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { SelectField, type SelectOption } from './select-field'

const meta: Meta = {
  title: 'Components / SelectField',
  ...defineMeta(SelectField, {
    props: {
      options: loremArray(1, 20).map(
        (_, index): SelectOption => ({
          value: String(index),
          label: loremFullName(),
          disabled: loremFalse(),
        }),
      ),
      value: null,
    },
    events: ['onChange'],
  }),
}

const Default: StoryObj<typeof SelectField> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
