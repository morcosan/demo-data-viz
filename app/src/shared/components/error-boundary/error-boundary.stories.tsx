import { defineMeta } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { ErrorBoundary } from './error-boundary'

const meta: Meta = {
  title: 'Components / ErrorBoundary',
  ...defineMeta(ErrorBoundary, {
    slots: {
      children: 'throw new Error("Custom error example")',
    },
  }),

  render: ({ children }: ReactProps) => {
    const ThrowError = () => {
      eval(children as string)
      return null
    }
    return (
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
  },
}

const Default: StoryObj<typeof ErrorBoundary> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
