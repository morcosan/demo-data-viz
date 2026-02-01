import { createArgsConfig, loremLongText, useLocationMock } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { AppLogo } from '../app-logo/app-logo.tsx'
import { NavMenu, type NavMenuProps } from '../nav-menu/nav-menu.tsx'
import { AppNav, type AppNavProps } from './app-nav.tsx'

const meta: Meta<typeof AppNav> = {
	component: AppNav,
	title: 'Components / AppNav',
	...createArgsConfig<typeof AppNav>({
		args: {
			slots: {
				appLogo: undefined,
				navMenu: undefined,
				children: loremLongText(),
			},
			props: {
				mobileHeight: 'var(--ds-spacing-sm-6)',
				desktopMinWidth: 'var(--ds-spacing-md-2)',
				desktopMaxWidth: 'var(--ds-spacing-lg-5)',
				cookieKeyPinned: 'app-nav--pinned-sidebar',
			},
		},
	}),
	render: function Story(props: AppNavProps) {
		const { location } = useLocationMock()

		return (
			<AppNav
				{...props}
				appLogo={props.appLogo ? () => props.appLogo as any : AppLogo}
				navMenu={
					props.navMenu
						? () => props.navMenu as any
						: (navMenuProps: NavMenuProps) => <NavMenu {...navMenuProps} pathname={location.pathname} />
				}
			/>
		)
	},
}

const Default: StoryObj<typeof AppNav> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
