import { TextHighlight } from '@app-components'
import { formatNumber } from '@app/shared/utils/formatting'
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
  const { className, dataset, height, keyword, onClick, selected, style } = props

  return (
    <li className={className} style={style}>
      <Link
        href={`/datasets?id=${encodeURIComponent(dataset.id)}`}
        className={cx(
          'relative flex flex-wrap items-center overflow-hidden',
          'px-xs-4 py-xs-2 rounded-sm shadow-xs',
          'active:translate-y-px',
          selected
            ? 'bg-color-secondary-button-bg text-color-secondary-button-text font-weight-md'
            : 'bg-color-bg-card',
        )}
        style={{ height }}
        onClick={onClick}
      >
        <TextHighlight text={dataset.title} query={keyword} className="text-size-sm font-weight-md line-clamp-2" />
        <span className="w-full" />
        <span className="text-size-xs text-color-text-subtle font-weight-sm">
          {dataset.stats && `${formatNumber(dataset.stats.colsCount)} x ${formatNumber(dataset.stats.rowsCount)}`}
        </span>

        {/* OVERLAY */}
        <span className={cx('hover:bg-color-hover-text-default absolute-overlay')} />
      </Link>
    </li>
  )
}
