import { IconButton, type IconButtonVariant, LogoutSvg } from '@ds/core'
import { defineMeta, DocsPage } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Components / Icon Button',
  ...defineMeta(IconButton, {
    slots: {
      children: '⭐',
      tooltip: 'Tooltip',
      ariaDescription: 'Example description',
    },
    props: {
      size: 'md',
      variant: 'text-default',
      pressed: false,
      loading: false,
      disabled: false,
      linkHref: '',
      linkType: 'internal',
      className: '',
    },
    events: ['onClick'],
    inlineRadios: ['size', 'variant', 'linkType'],
  }),
}

const Default: StoryObj<typeof IconButton> = {
  tags: ['autodocs', 'controls'],
}

const Variants: StoryObj<typeof IconButton> = {
  render() {
    const svg = <LogoutSvg className="h-xs-7 w-xs-7" />
    const variants: IconButtonVariant[] = [
      'text-default',
      'text-subtle',
      'text-danger',
      'solid-primary',
      'solid-secondary',
      'solid-danger',
      'ghost-primary',
      'ghost-secondary',
      'ghost-danger',
    ]

    return (
      <DocsPage type="component">
        <div className="gap-xs-7 p-sm-0 flex flex-col">
          {variants.map((variant) => (
            <div key={variant} className="gap-xs-7 flex flex-wrap items-center">
              <IconButton tooltip={variant} variant={variant}>
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' pressed'} variant={variant} pressed>
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' loading'} variant={variant} loading>
                {svg}
              </IconButton>
              <IconButton tooltip={variant + ' disabled'} variant={variant} disabled>
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
