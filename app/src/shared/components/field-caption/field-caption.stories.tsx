import { TextField } from '@ds/core'
import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { FieldCaption } from './field-caption'

const meta: Meta = {
  title: 'Components / FieldCaption',
  ...defineMeta(FieldCaption, {
    slots: {
      children: 'This is a helper text for a field',
    },
    props: {
      id: 'example-id',
      className: '',
      style: {},
    },
  }),
  render: (props: ReactProps) => {
    return (
      <div>
        <TextField id="id" ariaDescribedBy={props.id} />
        <FieldCaption {...props} />
      </div>
    )
  },
}

const Default: StoryObj<typeof FieldCaption> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
