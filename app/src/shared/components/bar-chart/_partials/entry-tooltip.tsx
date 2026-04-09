import { formatNumber } from '@app/shared/utils/formatting'
import { Fragment, type ReactNode } from 'react'
import type { TooltipContentProps } from 'recharts'

interface Props extends TooltipContentProps, ReactProps {
  visible: boolean
  barNames: Record<string, string>
  labelFn: (value: string) => ReactNode
}

// This component will rerender on mousemove, due to bad recharts implementation
export const EntryTooltip = (props: Props) => {
  const { barNames, id, label, labelFn, payload, ref, visible } = props
  const title = labelFn(String(label)) || label

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        'px-xs-5 py-xs-3 min-w-md-9 rounded-xs',
        'bg-color-bg-card border-color-border-shadow border shadow-sm',
        'text-size-sm',
        !visible && 'hidden',
      )}
    >
      <div className="font-weight-lg mb-xs-4" aria-label={`${label},`}>
        {title}
      </div>

      <div className="gap-xs-2 grid w-full grid-cols-[auto_1fr]">
        {payload.map((bar, index) => (
          <Fragment key={String(bar.dataKey) + index}>
            <div>{barNames[bar.name || '']}:</div>
            <div className="font-weight-lg font-family-mono" aria-label={`${formatNumber(bar.value as number)},`}>
              {formatNumber(bar.value as number)}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
