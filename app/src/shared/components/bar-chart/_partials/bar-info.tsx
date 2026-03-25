import type { ReactNode } from 'react'
import type { TooltipContentProps } from 'recharts'

interface Props extends TooltipContentProps, ReactProps {
  visible: boolean
  barLabels: Record<string, string>
  labelFn?: (value: string) => ReactNode
}

export const BarInfo = (props: Props) => {
  // This component will rerender on mousemove, due to bad recharts implementation

  const label = props.label ? String(props.label) : ''
  const tdClass = cx('px-xs-2 pt-px')

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
      <div className="font-weight-lg mb-xs-1">{props.labelFn?.(label) || label}</div>

      <table className="w-full">
        <tbody>
          {props.payload.map((bar, index) => (
            <tr key={String(bar.dataKey) + index}>
              <td className={tdClass}>{props.barLabels[bar.name || '']}:</td>
              <td className={tdClass}>{bar.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
