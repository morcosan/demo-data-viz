import { defineMeta } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { AppLogo } from './app-logo.tsx'

const meta: Meta = {
  title: 'Components / AppLogo',
  ...defineMeta(AppLogo, {
    props: {
      mobile: false,
      collapsed: false,
      className: '',
    },
  }),
}

const Default: StoryObj<typeof AppLogo> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
