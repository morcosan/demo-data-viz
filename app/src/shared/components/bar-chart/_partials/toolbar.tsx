import { useTranslation } from '@app-i18n'
import { IconButton, SortAscSvg, SortDescSvg, SortNoneSvg } from '@ds/core'
import { type ReactNode } from 'react'

interface Props extends ReactProps {
  barNames: Record<string, string>
  entryKey: string
  entryName: string
  entryWidth: number
  sortKey: string | null
  sortDir: 'asc' | 'desc' | false
  onSort: (key: string) => void
  toolbar?: ReactNode
}

export const Toolbar = (props: Props) => {
  const { t } = useTranslation()
  const barKeys = Object.keys(props.barNames)

  const cellClass = cx('px-xs-5 gap-xs-0 max-w-lg-2 flex h-full items-center')

  const renderCell = (key: string, name: string, className?: string, width?: number) => {
    const sort = props.sortKey === key && props.sortDir

    return (
      <div key={key} className={cx(cellClass, className)} style={{ width }}>
        <span className="pt-xs truncate">{name}</span>

        <IconButton
          tooltip={t('core.action.sort')}
          variant={sort ? 'solid-secondary' : 'text-default'}
          size="sm"
          className="rounded-full! before:rounded-full! after:rounded-full!"
          onClick={() => props.onSort(key)}
        >
          {sort === 'asc' && <SortAscSvg className="h-xs-8" />}
          {sort === 'desc' && <SortDescSvg className="h-xs-8" />}
          {sort === false && <SortNoneSvg className="h-xs-6 text-color-text-subtle" />}
        </IconButton>
      </div>
    )
  }

  return (
    <div
      className={cx(
        'z-sticky bg-color-bg-card shadow-below-sm',
        'gap-x-xs-1 flex items-center',
        'text-size-sm font-weight-lg',
        props.className,
      )}
    >
      {renderCell(props.entryKey, props.entryName, 'ml-xs-3 justify-end px-0! mr-xs-3', props.entryWidth)}

      {barKeys.map((key) => renderCell(key, props.barNames[key]))}

      {props.toolbar}
    </div>
  )
}
