import { formatNumber } from '@app/shared/utils/formatting'
import { Fragment } from 'react'
import type { TooltipContentProps } from 'recharts'

interface Props extends TooltipContentProps, ReactProps {
  visible: boolean
  title: string
  barNames: Record<string, string>
}

// This component will rerender on mousemove, due to bad recharts implementation
export const EntryTooltip = (props: Props) => {
  return (
    <div
      ref={props.ref}
      id={props.id}
      className={cx(
        'px-xs-4 py-xs-4 min-w-md-9 rounded-xs',
        'bg-color-bg-card border-color-border-shadow border shadow-sm',
        'text-size-sm',
        !props.visible && 'hidden',
      )}
    >
      <div className="font-weight-lg mb-xs-4" aria-label={`${props.title},`}>
        {props.title}
      </div>

      <div className="gap-xs-2 -mb-xs-0 grid w-full grid-cols-[auto_1fr]">
        {props.payload.map((bar, index) => (
          <Fragment key={String(bar.dataKey) + index}>
            <div>{props.barNames[bar.name || '']}:</div>
            <div className="font-weight-lg" aria-label={`${formatNumber(bar.value as number)},`}>
              {formatNumber(bar.value as number)}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
