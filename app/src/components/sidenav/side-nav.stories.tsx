import { createArgsConfig, loremLongText } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { SideNav, type SideNavProps } from './side-nav.tsx'

const meta: Meta<typeof SideNav> = {
	component: SideNav,
	title: 'Components / SideNav',
	...createArgsConfig<typeof SideNav>({
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
	render: function Story(props: SideNavProps) {
		return <SideNav {...props} navContentFn={new Function(`return ${props.navContentFn}`)()} />
	},
}

const Default: StoryObj<typeof SideNav> = {
	tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
