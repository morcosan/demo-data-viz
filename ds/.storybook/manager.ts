import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { addonConfig } from '../dist/tooling/storybook.ts'

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Design System',
    brandImage: './ds-logo-lockup.svg',
  }),
  ...addonConfig,
})
