import { Button, type ButtonVariant, LogoutSvg } from '@ds/core.ts'
import { createArgsConfig, DocsPage } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof Button> = {
	component: Button,
	title: 'Components / Button',
	...createArgsConfig<typeof Button>({
		args: {
			slots: {
				children: 'Test qyp',
				tooltip: 'Tooltip',
				ariaDescription: 'Example description',
			},
			props: {
				size: 'md',
				variant: 'solid-primary',
				highlight: 'default',
				loading: false,
				disabled: false,
				linkHref: '',
				linkType: 'internal',
				className: '',
			},
			events: ['onClick'],
		},
		inlineRadios: ['size', 'variant', 'highlight', 'linkType'],
	}),
}

const Default: StoryObj<typeof Button> = {
	tags: ['autodocs', 'controls'],
}

const Variants: StoryObj<typeof Button> = {
	render() {
		const svg = <LogoutSvg className="mr-xs-4 h-xs-7 w-xs-7" />
		const variants: ButtonVariant[] = [
			'solid-primary',
			'solid-secondary',
			'solid-danger',
			'ghost-primary',
			'ghost-secondary',
			'ghost-danger',
			'text-default',
			'text-subtle',
			'text-danger',
			'item-solid-secondary',
			'item-text-default',
			'item-text-danger',
		]

		return (
			<DocsPage type="component">
				<div className="gap-xs-7 p-xs-8 flex flex-col">
					{variants.map((variant) => (
						<div key={variant} className="gap-xs-6 flex flex-wrap items-center">
							<Button variant={variant} className="w-lg-4">
								{svg} {variant}
							</Button>
							<Button variant={variant} highlight="pressed">
								{svg} pressed
							</Button>
							<Button variant={variant} highlight="selected">
								{svg} selected
							</Button>
							<Button variant={variant} loading>
								{svg} loading
							</Button>
							<Button variant={variant} disabled>
								{svg} disabled
							</Button>
							<Button variant={variant} size="xs">
								xs
							</Button>
							<Button variant={variant} size="sm">
								sm
							</Button>
							<Button variant={variant} size="md">
								md
							</Button>
							<Button variant={variant} size="lg">
								lg
							</Button>
						</div>
					))}
				</div>
			</DocsPage>
		)
	},
}

export default meta
export { Default, Variants }
