import { defineMeta, useLocationMock } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { NavMenu, type NavMenuProps } from './nav-menu'

const meta: Meta<typeof NavMenu> = {
  title: 'Components / NavMenu',
  ...defineMeta(NavMenu, {
    props: {
      pathname: '',
      closeMenu: () => {},
      mobile: false,
      collapsed: false,
      className: 'w-lg-7 bg-color-bg-card',
    },
    events: ['onTogglePopup'],
  }),

  render: function Story(props: NavMenuProps) {
    const { location } = useLocationMock()

    return <NavMenu {...props} pathname={props.pathname || location.pathname} />
  },
}

const Default: StoryObj<typeof NavMenu> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
