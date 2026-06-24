import { Card, type CardState } from '@ds/core'
import { defineMeta, DocsPage, loremLongText } from '@ds/docs/core'
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

const States: StoryObj<typeof Card> = {
  render() {
    const states: CardState[] = ['static', 'active', 'pressed', 'selected', 'loading', 'disabled']
    const content = loremLongText()

    return (
      <DocsPage type="component">
        <div className="gap-xs-7 p-xs-8 flex">
          {states.map((state) => (
            <div key={state} className="gap-xs-6 flex flex-col">
              <div className="text-size-xs text-color-text-subtle ml-xs-3">{state}</div>
              <Card state={state} className="w-lg-3">
                {content}
              </Card>
            </div>
          ))}
        </div>
      </DocsPage>
    )
  },
}

export default meta
export { Default, States }
