import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { StatsCard, type StatsCardProps } from './stats-card'

const meta: Meta = {
  title: 'Components / StatsCard',
  ...defineMeta(StatsCard, {
    slots: {
      children: '5 x 2,000',
    },
    props: {
      label: 'Data size',
      type: 'default',
    },
    events: ['onClick'],
  }),
}

const Default: StoryObj<typeof StatsCard> = {
  tags: ['controls', 'autodocs'],
}

const Examples: StoryObj<typeof StatsCard> = {
  tags: ['controls'],
  render: function Story(props: StatsCardProps) {
    return (
      <div className="gap-lg-0 p-sm-0 flex w-full flex-col">
        <div className="gap-xs-5 flex flex-wrap">
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard type="button" className="ml-auto">
            View details
          </StatsCard>
        </div>

        <div className="gap-xs-5 flex w-full flex-col">
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard {...props} />
          <StatsCard {...props} />
        </div>
      </div>
    )
  },
}

export default meta
export { Default, Examples }
