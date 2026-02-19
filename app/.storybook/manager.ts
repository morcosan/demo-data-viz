import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'
import { addonConfig } from '../../ds/dist/tooling/storybook'

addons.setConfig({
  theme: themes.dark,
  ...addonConfig,
})
