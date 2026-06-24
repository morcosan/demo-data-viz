import { Card } from '@ds/core'
import { defineMeta, loremLongText } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components / Card',
  ...defineMeta(Card, {
    slots: {
      children: loremLongText(),
      tooltip: 'Tooltip',
      ariaDescription: 'Example description',
    },
    props: {
      state: 'static',
      size: 'md',
      linkHref: '',
      linkType: 'internal',
      className: '',
      style: { maxWidth: '300px' },
      'data-prop': '',
    },
    events: ['onClick'],
    inlineRadios: ['state', 'size', 'linkType'],
  }),
}

const Default: StoryObj<typeof Card> = {
  tags: ['autodocs', 'controls'],
}

export default meta
export { Default }
