import { formatNumber } from '@app/shared/utils/formatting'
import { Fragment, type ReactNode } from 'react'
import type { TooltipContentProps } from 'recharts'

interface Props extends TooltipContentProps, ReactProps {
  visible: boolean
  barLabels: Record<string, string>
  labelFn?: (value: string) => ReactNode
}

export const EntryTooltip = (props: Props) => {
  // This component will rerender on mousemove, due to bad recharts implementation

  const label = props.label ? String(props.label) : ''
  const title = props.labelFn?.(label) || label
  const tdClass = cx('pt-px')

  return (
    <div
      ref={props.ref}
      id={props.id}
      className={cx(
        'px-xs-4 py-xs-3 min-w-md-5 rounded-xs',
        'bg-color-bg-card border-color-border-shadow border shadow-sm',
        'text-size-sm',
        !props.visible && 'hidden',
      )}
    >
      <div className="font-weight-lg mb-xs-1" aria-label={`${title},`}>
        {title}
      </div>

      <div className="gap-xs-2 grid w-full grid-cols-[auto_1fr]">
        {props.payload.map((bar, index) => (
          <Fragment key={String(bar.dataKey) + index}>
            <div className="pt-px">{props.barLabels[bar.name || '']}:</div>
            <div className="pt-px" aria-label={`${formatNumber(bar.value as number)},`}>
              {formatNumber(bar.value as number)}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
