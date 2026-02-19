import { HocComposer, I18nService, RoutingService } from '@ds/core.ts'
import { getDocsConfig, getStoryConfig, mockNavigate, mockTranslate, toolbarConfig } from '@ds/docs/core.ts'
import { type Preview } from '@storybook/react-vite'
import './styles.css'

LOG('BUILD_NUMBER:', ENV__BUILD_NUMBER)
LOG('DS_VERSION:', ENV__DS_VERSION)

const hoc = HocComposer.hoc
const providers = [
  hoc(I18nService, { translate: mockTranslate }),
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
      ...getDocsConfig(providers),
    },
  },
  ...toolbarConfig,
  ...getStoryConfig(providers),
}

export default preview
