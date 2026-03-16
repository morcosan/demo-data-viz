import { type TableCell, type TableCol, type TableRow } from '@app/shared/types/table'
import { type Cell, flexRender } from '@tanstack/react-table'

interface Props {
  cell: Cell<TableRow, TableCell>
  col: TableCol
  width: number
  height: number
  sticky?: boolean
}

export const RowCell = (props: Props) => {
  const isNumeric = props.col.type === 'int' || props.col.type === 'float'
  const cellClass = cx(
    'bg-color-bg-card border-color-border-subtle relative h-full border-b',
    props.sticky && 'border-r',
  )
  const innerClass = cx('absolute-center-y px-xs-6 flex h-full w-full items-center', isNumeric && 'justify-end')
  const textClass = cx('line-clamp-2', isNumeric ? 'pr-xs-6 font-family-mono text-size-sm-mono' : 'text-size-sm')

  return (
    <td
      className={cx(props.sticky && 'sticky z-10')}
      style={{
        width: props.width,
        maxWidth: props.sticky ? props.width : undefined,
        height: props.height,
        left: props.sticky ? 0 : undefined,
      }}
    >
      <div className={cellClass}>
        <div className={innerClass}>
          <div className={textClass}>{flexRender(props.cell.column.columnDef.cell, props.cell.getContext())}</div>
        </div>
      </div>
    </td>
  )
}
