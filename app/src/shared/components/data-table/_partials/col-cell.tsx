import { useTranslation } from '@app-i18n'
import { type TableRow } from '@app/shared/types/table'
import { IconButton, SortAscSvg, SortDescSvg, SortNoneSvg } from '@ds/core'
import { flexRender, type Header } from '@tanstack/react-table'

interface Props {
  cell: Header<TableRow, unknown>
  width: number
  sticky?: boolean
}

export const ColCell = (props: Props) => {
  const { t } = useTranslation()
  const sort = props.cell.column.getIsSorted()

  const cellClass = cx(
    'px-xs-6 py-xs-2 gap-xs-1 flex h-full items-center',
    'bg-color-bg-card',
    'text-size-sm font-weight-lg truncate',
    props.sticky && 'border-color-border-subtle border-r',
  )

  return (
    <th
      title={props.cell.column.columnDef.header as string}
      className={cx(props.sticky && 'sticky z-10')}
      style={{
        width: props.width,
        maxWidth: props.sticky ? props.width : undefined,
        left: props.sticky ? 0 : undefined,
      }}
    >
      <div className={cellClass}>
        <span className="truncate">{flexRender(props.cell.column.columnDef.header, props.cell.getContext())}</span>

        {props.cell.column.getCanSort() && (
          <IconButton
            tooltip={t('core.action.sort')}
            variant={sort ? 'solid-secondary' : 'text-default'}
            size="sm"
            className="rounded-full! before:rounded-full! after:rounded-full!"
            onClick={props.cell.column.getToggleSortingHandler()}
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
