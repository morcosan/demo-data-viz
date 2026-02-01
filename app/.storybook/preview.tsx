import { HocComposer, RoutingService } from '@ds/core.ts'
import { getDocsConfig, getStoryConfig, mockNavigate, toolbarConfig } from '@ds/docs/core.ts'
import { type Preview } from '@storybook/nextjs-vite'
import { initClientI18n } from '../src/i18n/i18n-client.ts'
import { I18nProvider } from '../src/i18n/i18n-provider.tsx'
import './styles.css'

LOG('BUILD_NUMBER:', ENV__BUILD_NUMBER)
LOG('DS_VERSION:', ENV__DS_VERSION)
LOG('BASE_PATH:', ENV__BASE_PATH)

initClientI18n()

const hoc = HocComposer.hoc
const providers = [
	hoc(I18nProvider, {}),
	hoc(RoutingService, { navigate: mockNavigate }),
	//
]

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
		docs: {
			...(getDocsConfig(providers) as any),
		},
	},
	...toolbarConfig,
	...getStoryConfig(providers),
}

export default preview
