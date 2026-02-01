import {
	A11yService,
	ConfigService,
	HocComposer,
	ThemeService,
	ViewportService,
	type ColorTheme,
	type HOC,
} from '@ds/core.ts'
import { DocsCodeBlock } from '@ds/docs/core.ts'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { StrictMode, type ComponentType, type ReactNode } from 'react'
import { fn } from 'storybook/test'
import { DocsPage } from '../components/docs-page.tsx'
import { DocsCanvasService, type DocsCanvasBg } from '../services/docs-canvas-service.tsx'
import { fixBrokenCSS } from './_css-fix.ts'

interface GlobalConfig<T> {
	description: string
	toolbar: {
		title: string
		icon: string
		items: Array<{ value: T; title: string; icon: string }>
	}
}
interface GlobalTypes {
	colorTheme?: GlobalConfig<ColorTheme>
	canvasBg?: GlobalConfig<DocsCanvasBg>
}
interface GlobalDefaults {
	colorTheme?: ColorTheme | '_reset'
	canvasBg?: DocsCanvasBg | '_reset'
}
interface PreviewToolbar {
	globalTypes: GlobalTypes
	initialGlobals: GlobalDefaults
}
interface PreviewStory {
	decorators: Array<(Story: ComponentType, ctx: StoryContext) => ReactNode>
}
interface PreviewDocs {
	components: {
		[key: string]: JsxFn<any>
	}
	container: ({ children, context }: DocsContext) => ReactNode
}
interface StoryContext<C = any> {
	globals: GlobalDefaults
	tags: string[]
	viewMode: 'docs' | 'story'
	args: C
	children?: ReactNode
}
interface DocsContext {
	children: ReactNode
	context: {
		attachedCSFFiles: Set<unknown>
		store: { userGlobals: { globals: GlobalDefaults } }
	}
}

const computeServices = (providers: HOC[], globals: GlobalDefaults): HOC[] => {
	const colorTheme = !globals.colorTheme || globals.colorTheme === '_reset' ? 'light' : globals.colorTheme
	const canvasBg = !globals.canvasBg || globals.canvasBg === '_reset' ? 'grid' : globals.canvasBg
	const hoc = HocComposer.hoc
	return [
		hoc(StrictMode, {}),
		hoc(ConfigService, {}),
		hoc(A11yService, {}),
		hoc(ViewportService, {}),
		hoc(ThemeService, { cookieKey: 'ds-color-theme', colorTheme }),
		hoc(DocsCanvasService, { canvasBg }),
		...providers,
	]
}

const toolbarConfig = {
	globalTypes: {
		colorTheme: {
			description: 'Change color theme',
			toolbar: {
				title: 'Light',
				icon: 'sun' as any,
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' as any },
					{ value: 'dark', title: 'Dark', icon: 'moon' as any },
				],
			},
		},
		canvasBg: {
			description: 'Change canvas background',
			toolbar: {
				title: 'Grid',
				icon: 'photo' as any,
				items: [
					{ value: 'grid', title: 'Grid', icon: 'photo' as any },
					{ value: 'tiles', title: 'Tiles', icon: 'photo' as any },
					{ value: 'blank', title: 'Blank', icon: 'photo' as any },
				],
			},
		},
	},
	initialGlobals: {
		colorTheme: 'light',
		canvasBg: 'grid',
	},
} satisfies PreviewToolbar

const getStoryConfig = (providers: HOC[]) => {
	return {
		decorators: [
			(Story: ComponentType, { globals, tags, viewMode }: StoryContext) => (
				<HocComposer hocs={computeServices(providers, globals)}>
					{tags.includes('autodocs') || tags.includes('controls') ? (
						<DocsPage type={viewMode === 'docs' ? 'autodocs' : 'component'}>
							<Story />
						</DocsPage>
					) : (
						<Story />
					)}
				</HocComposer>
			),
		],
	} satisfies PreviewStory
}

const getDocsConfig = (providers: HOC[]) => {
	return {
		components: {
			pre: (props: { className?: string; children: string | { props: ReactProps } }) => {
				let children, className

				if (typeof props.children === 'string') {
					children = props.children
					className = props.className
				} else {
					children = props.children?.props.children
					className = props.children?.props.className
				}

				return <DocsCodeBlock code={String(children)} language={className?.replace('language-', '') as any} />
			},
		},

		container: (props: DocsContext) => {
			const isAutodocs = props.context.attachedCSFFiles?.size > 0

			fixBrokenCSS()

			return isAutodocs ? (
				<DocsContainer {...(props as any)} />
			) : (
				<HocComposer hocs={computeServices(providers, props.context.store.userGlobals.globals)}>
					<DocsContainer {...(props as any)}>
						<DocsPage type="mdx">{props.children}</DocsPage>
					</DocsContainer>
				</HocComposer>
			)
		},
	} satisfies PreviewDocs
}

const mockNavigateFn = fn().mockName('navigate')
const mockNavigate = (...args: any[]) => {
	mockNavigateFn(...args)
	window.dispatchEvent(new CustomEvent('sb:navigate', { detail: args }))
}

const TRANSLATIONS: Record<string, string> = {
	'ds.action.close': 'Close',
}
const mockTranslate = (key: string) => TRANSLATIONS[key] || key

export { getDocsConfig, getStoryConfig, mockNavigate, mockTranslate, toolbarConfig }
export type { GlobalConfig, GlobalDefaults, GlobalTypes, StoryContext }
