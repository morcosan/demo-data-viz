import { defineMeta } from '@ds/docs/core.ts'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { LoadingSpinner } from './loading-spinner.tsx'

const meta: Meta = {
  title: 'Components / LoadingSpinner',
  ...defineMeta(LoadingSpinner, {
    props: {
      size: 'sm',
      className: '',
    },
  }),
}

const Default: StoryObj<typeof LoadingSpinner> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
