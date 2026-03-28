import { useTranslation } from '@app-i18n'
import { IconButton, SortAscSvg, SortDescSvg, SortNoneSvg } from '@ds/core'

interface Props extends ReactProps {
  entryKey: string
  entryName: string
  entryWidth: number
  sortKey: string | null
  sortDir: 'asc' | 'desc' | false
  onSort: (key: string) => void
}

export const Toolbar = (props: Props) => {
  const { t } = useTranslation()

  const cellClass = cx('px-xs-5 gap-xs-0 flex h-full items-center', 'text-size-sm font-weight-lg')

  return (
    <div className={cx('z-sticky bg-color-bg-card shadow-below-sm', props.className)}>
      <div className={cx(cellClass, 'ml-xs-3 justify-end px-0!')} style={{ width: props.entryWidth }}>
        <span className="pt-xs-0 truncate">{props.entryName}</span>

        <IconButton
          tooltip={t('core.action.sort')}
          variant={props.sortKey === props.entryKey && props.sortDir ? 'solid-secondary' : 'text-default'}
          size="sm"
          className="rounded-full! before:rounded-full! after:rounded-full!"
          onClick={() => props.onSort(props.entryKey)}
        >
          {props.sortDir === 'asc' && <SortAscSvg className="h-xs-8" />}
          {props.sortDir === 'desc' && <SortDescSvg className="h-xs-8" />}
          {props.sortDir === false && <SortNoneSvg className="h-xs-6 text-color-text-subtle" />}
        </IconButton>
      </div>
    </div>
  )
}
