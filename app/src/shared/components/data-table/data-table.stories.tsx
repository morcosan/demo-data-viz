import { type TableCol } from '@app/shared/types/table'
import {
  defineMeta,
  loremArray,
  loremBool,
  loremFalse,
  loremFloat,
  loremInt,
  loremText,
  loremTrue,
} from '@ds/docs/core'
import { type Meta, type StoryObj } from '@storybook/nextjs-vite'
import { DataTable, type DataTableProps } from './data-table'

const cols: TableCol[] = loremArray(4, 50).map((_, index: number) => ({
  key: String(index),
  label: `Header ${index + 1}`,
  size: loremInt(100, 200),
  type: loremBool() ? 'any' : loremBool() ? 'int' : 'float',
}))
const MIN_MAX = 1_000_000_000

const meta: Meta = {
  title: 'Components / DataTable',
  ...defineMeta(DataTable, {
    props: {
      data: {
        cols,
        rows: loremArray(100).map(() => {
          return Object.fromEntries(
            cols.map((col: TableCol) => [
              col.key,
              loremTrue()
                ? col.type === 'int' || col.type === 'float'
                  ? loremFalse()
                    ? 0
                    : loremBool()
                      ? loremInt(-MIN_MAX, MIN_MAX)
                      : loremFloat(-MIN_MAX, MIN_MAX)
                  : loremFalse()
                    ? loremBool()
                      ? loremInt(-MIN_MAX, MIN_MAX)
                      : loremFloat(-MIN_MAX, MIN_MAX)
                    : loremText(3)
                : '',
            ]),
          )
        }),
      },
      cellFn: '' as any,
      query: '',
      loading: false,
      sticky: false,
      className: '',
      style: { height: '600px' },
    },
    clearDefaults: ['data', 'cellFn'],
    render: (props: DataTableProps) => {
      return <DataTable {...props} cellFn={props.cellFn ? eval(String(props.cellFn)) : undefined} />
    },
  }),
}

const Default: StoryObj<typeof DataTable> = {
  tags: ['controls', 'autodocs'],
}

export default meta
export { Default }
