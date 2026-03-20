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
    },
    clearDefaults: ['label'],

    render: (props: TooltipProps) => (
      <Tooltip {...props}>
        {props.children ? (
          <div dangerouslySetInnerHTML={{ __html: props.children || '' }} />
        ) : (
          <div className="border" tabIndex={0}>
            Content with tooltip
          </div>
        )}
      </Tooltip>
    ),
  }),
}

const Default: StoryObj<typeof Tooltip> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
