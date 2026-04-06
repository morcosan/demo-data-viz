import { useTranslation } from '@app-i18n'
import { type TableCol, type TableRow } from '@app/shared/types/table'
import { IconButton, SortAscSvg, SortDescSvg, SortNoneSvg } from '@ds/core'
import { flexRender, type Header } from '@tanstack/react-table'

interface Props {
  cell: Header<TableRow, unknown>
  col: TableCol
  width: number
  sticky?: boolean
}

export const ColCell = ({ cell, col, width, sticky }: Props) => {
  const { t } = useTranslation()
  const sort = cell.column.getIsSorted()

  const isNumeric = col.type === 'int' || col.type === 'float'
  const cellClass = cx(
    'px-xs-6 py-xs-2 gap-xs-0 flex h-full items-center',
    'bg-color-bg-card',
    'text-size-sm font-weight-lg truncate',
    sticky && 'border-color-border-subtle border-r',
    isNumeric && 'justify-end',
  )

  return (
    <th
      title={cell.column.columnDef.header as string}
      className={cx(sticky && 'sticky z-10')}
      style={{
        width: width,
        maxWidth: sticky ? width : undefined,
        left: sticky ? 0 : undefined,
      }}
    >
      <div className={cellClass}>
        <span className="pt-xs truncate">{flexRender(cell.column.columnDef.header, cell.getContext())}</span>

        {cell.column.getCanSort() && (
          <IconButton
            tooltip={t('core.action.sort')}
            variant={sort ? 'solid-secondary' : 'text-default'}
            size="sm"
            className="rounded-full! before:rounded-full! after:rounded-full!"
            onClick={cell.column.getToggleSortingHandler()}
          >
            {sort === 'asc' && <SortAscSvg className="h-xs-8" />}
            {sort === 'desc' && <SortDescSvg className="h-xs-8" />}
            {sort === false && <SortNoneSvg className="h-xs-6 text-color-text-subtle" />}
          </IconButton>
        )}
      </div>
    </th>
  )
}
