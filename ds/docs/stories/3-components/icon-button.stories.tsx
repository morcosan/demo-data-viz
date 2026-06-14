import { IconButton, type IconButtonVariant, LogoutSvg } from '@ds/core'
import { defineMeta, DocsPage } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components / Icon Button',
  ...defineMeta(IconButton, {
    slots: {
      children: 'A',
      tooltip: 'Tooltip',
      ariaDescription: 'Example description',
    },
    props: {
      state: 'default',
      variant: 'default',
      size: 'md',
      linkHref: '',
      linkType: 'internal',
      className: '',
      style: {},
      'data-prop': '',
    },
    events: ['onClick'],
    inlineRadios: ['state', 'size', 'variant', 'linkType'],
  }),
}

const Default: StoryObj<typeof IconButton> = {
  tags: ['autodocs', 'controls'],
}

const Variants: StoryObj<typeof IconButton> = {
  render() {
    const svg = <LogoutSvg className="h-xs-7 w-xs-7" />
    const variants: IconButtonVariant[] = ['primary', 'secondary', 'default', 'optional', 'danger', 'caution']

    return (
      <DocsPage type="component">
        <div className="gap-xs-7 p-sm-0 flex flex-col">
          {variants.map((variant) => (
            <div key={variant} className="gap-xs-7 flex flex-wrap items-center">
              <IconButton tooltip={variant} variant={variant}>
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' pressed'} variant={variant} state="pressed">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' selected'} variant={variant} state="selected">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' loading'} variant={variant} state="loading">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' disabled'} variant={variant} state="disabled">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' xs'} variant={variant} size="xs">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' sm'} variant={variant} size="sm">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' md'} variant={variant} size="md">
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' lg'} variant={variant} size="lg">
                {svg}
              </IconButton>
            </div>
          ))}
        </div>
      </DocsPage>
    )
  },
}

export default meta
export { Default, Variants }
