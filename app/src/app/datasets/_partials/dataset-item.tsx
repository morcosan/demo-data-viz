import { TextHighlight } from '@app-components'
import { useTranslation } from '@app-i18n'
import { formatNumber } from '@app/shared/utils/js-utils'
import Link from 'next/link'
import { type BaseDataset } from '../_types'

interface Props extends ReactProps {
  dataset: BaseDataset
  keyword: string
  height: number
  selected?: boolean
  onClick?: () => void
}

export const DatasetItem = (props: Props) => {
  const { t } = useTranslation()

  return (
    <li className={props.className} style={props.style}>
      <Link
        href={`/datasets?id=${encodeURIComponent(props.dataset.id)}`}
        className={cx(
          'relative flex flex-wrap items-center overflow-hidden',
          'px-xs-4 py-xs-2 rounded-sm shadow-xs',
          'active:translate-y-px',
          props.selected
            ? 'bg-color-secondary-button-bg text-color-secondary-button-text font-weight-md'
            : 'bg-color-bg-card',
        )}
        style={{ height: props.height }}
        onClick={props.onClick}
      >
        <TextHighlight
          text={props.dataset.title}
          query={props.keyword}
          className="text-size-sm font-weight-md line-clamp-2"
        />
        <span className="text-size-xs text-color-text-subtle font-weight-sm w-full">
          {props.dataset.stats
            ? t('dataViz.label.datasetSize', {
                cols: formatNumber(props.dataset.stats.colsCount),
                rows: formatNumber(props.dataset.stats.rowsCount),
              })
            : t('dataViz.label.datasetSizeUnknown')}
        </span>

        {/* OVERLAY */}
        <span className={cx('hover:bg-color-hover-text-default absolute-overlay')} />
      </Link>
    </li>
  )
}
