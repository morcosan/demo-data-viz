import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { AppNav, type AppNavProps } from './app-nav.tsx'

const meta: Meta<typeof AppNav> = {
	component: AppNav,
	title: 'Components / AppNav',
	...createArgsConfig<typeof AppNav>({
		args: {
			slots: {
				navMenu: '() => `Nav Menu`' as any,
				appLogo: '() => `App Logo`' as any,
				children: loremLongText(),
			},
			props: {
				mobileHeight: 'var(--ds-spacing-sm-6)',
				desktopMinWidth: 'var(--ds-spacing-md-6)',
				desktopMaxWidth: 'var(--ds-spacing-lg-7)',
				cookieKeyPinned: 'app-nav--pinned-sidebar',
				hasActivePopup: false,
			},
		},
	}),
	render: function Story(props: AppNavProps) {
		return (
			<AppNav
				{...props}
				navMenu={new Function(`return ${props.navMenu}`)()}
				appLogo={new Function(`return ${props.appLogo}`)()}
			/>
		)
	},
}

const Default: StoryObj<typeof AppNav> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
