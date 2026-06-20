import { Card } from '@ds/core'
import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components / Card',
  ...defineMeta(Card, {
    slots: {
      children: 'Test qyp',
      tooltip: 'Tooltip',
      ariaDescription: 'Example description',
    },
    props: {
      state: 'static',
      linkHref: '',
      linkType: 'internal',
      className: '',
      style: {},
      'data-prop': '',
    },
    events: ['onClick'],
    inlineRadios: ['state', 'linkType'],
  }),
}

const Default: StoryObj<typeof Card> = {
  tags: ['autodocs', 'controls'],
}

export default meta
export { Default }
