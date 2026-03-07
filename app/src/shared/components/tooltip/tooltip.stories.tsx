import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { Tooltip, type TooltipProps } from './tooltip'

const meta: Meta = {
  title: 'Components / Tooltip',
  ...defineMeta(Tooltip, {
    slots: {
      children: '',
    },
    props: {
      label: 'Tooltip',
      inline: false,
    },
    clearDefaults: ['label'],
  }),
  // @ts-ignore
  render: function Story(props: TooltipProps) {
    return (
      <Tooltip {...props}>
        {props.children || (
          <div className="border" tabIndex={0}>
            Content with tooltip
          </div>
        )}
      </Tooltip>
    )
  },
}

const Default: StoryObj<typeof Tooltip> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
