import { type TableCol } from '@app/shared/utils/json-stat'
import { defineMeta, loremArray, loremInt, loremText } from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { DataTable } from './data-table'

const cols: TableCol[] = loremArray(4, 10).map((_, index: number) => ({
  key: String(index),
  label: `Header ${index + 1}`,
  size: loremInt(100, 200),
}))

const meta: Meta = {
  title: 'Components / DataTable',
  ...defineMeta(DataTable, {
    slots: {
      toolbar: 'Toolbar slot',
    },
    props: {
      data: {
        cols,
        rows: loremArray(100).map(() => {
          return Object.fromEntries(cols.map((col: TableCol) => [col.key, loremText(3)]))
        }),
        consts: [],
      },
      cellFn: undefined,
      className: '',
      tableClassName: '',
      style: { height: '600px' },
    },
  }),
}

const Default: StoryObj<typeof DataTable> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
