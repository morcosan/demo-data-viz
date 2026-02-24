import { defineMeta, loremLongText } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LoadingScreen } from './loading-screen'

const meta: Meta = {
  title: 'Components / LoadingScreen',
  ...defineMeta(LoadingScreen, {
    slots: {
      children: loremLongText(),
    },
    props: {
      minTimeout: 0,
      maxTimeout: 3000,
    },
  }),
}

const Default: StoryObj<typeof LoadingScreen> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
