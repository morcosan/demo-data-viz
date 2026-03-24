import type { TooltipContentProps } from 'recharts'

export const BarInfo = (props: TooltipContentProps) => {
  if (!props.active || !props.payload?.length) return null

  return (
    <div className="bg-color-bg-card border-color-border-shadow text-size-sm rounded-sm border px-3 py-2 shadow-md">
      <p>{props.label}</p>

      <ul>
        {props.payload.map((entry) => (
          <li key={entry.key}>
            {entry.name}: {entry.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
