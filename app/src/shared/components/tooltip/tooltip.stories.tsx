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

    render: ({ children, ...rest }: TooltipProps) => (
      <Tooltip {...rest}>
        {children ? (
          <div dangerouslySetInnerHTML={{ __html: children || '' }} />
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
