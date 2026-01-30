import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { AppNav, type AppNavProps } from './app-nav.tsx'

const meta: Meta<typeof AppNav> = {
	component: AppNav,
	title: 'Components / AppNav',
	...createArgsConfig<typeof AppNav>({
		args: {
			slots: {
				navContentFn: '() => `Nav Content`' as any,
				children: loremLongText(),
			},
			props: {
				hasActivePopup: false,
			},
		},
	}),
	render: function Story(props: AppNavProps) {
		return <AppNav {...props} navContentFn={new Function(`return ${props.navContentFn}`)()} />
	},
}

const Default: StoryObj<typeof AppNav> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
