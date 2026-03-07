import { defineMeta, loremArray, loremFalse, loremFullName } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { SelectField, type SelectFieldProps, type SelectOption } from './select-field'

const meta: Meta = {
  title: 'Components / SelectField',
  ...defineMeta(SelectField, {
    props: {
      options: loremArray(10, 20).map(
        (_, index): SelectOption => ({
          value: String(index),
          label: loremFullName(),
          disabled: loremFalse(),
        }),
      ),
      value: '0',
      placeholder: '',
      clearable: false,
      className: '',
      style: '',
    },
    events: ['onChange'],
    clearDefaults: ['options', 'value'],
  }),
}

const Default: StoryObj<typeof SelectField> = {
  tags: ['controls', 'autodocs'],
}

const Examples: StoryObj<typeof SelectField> = {
  tags: ['controls'],
  render: function Story(props: SelectFieldProps) {
    return (
      <div className="p-sm-0 flex min-h-0 flex-1 flex-col justify-between">
        <SelectField {...props} />
        <SelectField {...props} />
      </div>
    )
  },
}

export default meta
export { Default, Examples }
