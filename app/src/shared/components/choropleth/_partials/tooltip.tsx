import { formatNumber } from '@app/shared/utils/formatting'
import type { ReactNode } from 'react'

interface Props {
  name: string
  value: number
  nameFn: (value: string) => ReactNode
}

export const Tooltip = ({ name, nameFn, value }: Props) => {
  if (value === undefined || isNaN(value)) return null

  const title = nameFn(String(name)) || name

  return (
    <div
      className={cx(
        'px-xs-5 py-xs-3 min-w-md-9 rounded-xs',
        'bg-color-bg-card border-color-border-shadow border shadow-sm',
        'text-size-sm',
      )}
    >
      <div className="font-weight-lg mb-xs-2" aria-label={`${name},`}>
        {title}
      </div>
      <div className="font-family-mono">{formatNumber(value as number)}</div>
    </div>
  )
}
