import type { TooltipContentProps } from 'recharts'

export const BarInfo = (props: TooltipContentProps) => {
  if (!props.active || !props.payload?.length) return null

  const tdClass = cx('px-xs-2 pt-px')

  return (
    <div
      className={cx(
        'px-xs-4 py-xs-3 min-w-md-5 rounded-xs',
        'bg-color-bg-card border-color-border-shadow border shadow-sm',
        'text-size-sm',
      )}
    >
      <div className="font-weight-lg mb-xs-1">{props.label}</div>

      <table className="w-full">
        <tbody>
          {props.payload.map((entry, index) => (
            <tr key={String(entry.dataKey) + index}>
              <td className={tdClass}>{entry.name}:</td>
              <td className={tdClass}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
