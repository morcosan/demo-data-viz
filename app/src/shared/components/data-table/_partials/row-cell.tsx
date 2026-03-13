import { type TableRow } from '@app/shared/types/table'
import { type Cell, flexRender } from '@tanstack/react-table'

interface Props {
  cell: Cell<TableRow, unknown>
  width: number
  height: number
  sticky?: boolean
}

export const RowCell = (props: Props) => {
  const cellClass = cx(
    'bg-color-bg-card border-color-border-subtle relative h-full border-b',
    props.sticky && 'border-r',
  )
  const innerClass = cx('absolute-center-y px-xs-6 flex h-full items-center')
  const textClass = cx('text-size-sm line-clamp-2')

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
