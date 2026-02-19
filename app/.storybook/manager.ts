import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'
import { addonConfig } from '../../ds/dist/tooling/storybook.ts'

addons.setConfig({
  theme: themes.dark,
  ...addonConfig,
})
