import { useTranslation } from '@app-i18n'
import { IconButton, SortAscSvg, SortDescSvg, SortNoneSvg, TOKENS } from '@ds/core'
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
  const {
    barNames,
    className,
    entryKey,
    entryName,
    entryWidth: entryWidthProp,
    onSort,
    sortDir,
    sortKey,
    toolbar,
  } = props
  const { t } = useTranslation()
  const barKeys = Object.keys(barNames)

  const cellClass = cx('gap-xs-0 flex items-center justify-end')
  const entryWidth = entryWidthProp + parseFloat(TOKENS.SPACING[TOKENS.SPACING['button-h-sm'].$ref].$value)

  const renderHeader = (key: string, name: string, className: string, width?: number) => {
    const sort = sortKey === key && sortDir

    return (
      <div key={key} className={cx(cellClass, className)} style={{ width }}>
        <span className="truncate pt-px">{name}</span>

        <IconButton
          tooltip={t('core.action.sort')}
          variant={sort ? 'solid-secondary' : 'text-default'}
          size="sm"
          className="rounded-full! before:rounded-full! after:rounded-full!"
          onClick={() => onSort(key)}
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
        'gap-y-xs-1 gap-x-sm-1 flex flex-wrap items-center',
        'text-size-sm font-weight-lg',
        className,
      )}
    >
      {renderHeader(entryKey, entryName, cx('pl-xs-2'), entryWidth)}

      {barKeys.map((key) => renderHeader(key, barNames[key], cx('max-w-lg-2')))}

      {toolbar}
    </div>
  )
}
