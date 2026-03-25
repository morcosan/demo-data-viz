import type { ReactNode } from 'react'
import type { CartesianTickItem } from 'recharts/types/util/types'

interface Props {
  width: number
  height: number
  x: number
  y: number
  payload: CartesianTickItem
  labelFn?: (value: string) => ReactNode
}

export const EntryLabel = (props: Props) => {
  const posY = props.y - props.height / 2
  const label = props.payload?.value

  return (
    <foreignObject x={0} y={posY} width={props.width} height={props.height}>
      <div
        className={cx(
          'pl-xs-5 pr-xs-4 overflow-hidden',
          'flex h-full w-full items-center justify-end',
          'text-size-sm leading-sm text-right',
        )}
      >
        {props.labelFn?.(label) || label}
      </div>
    </foreignObject>
  )
}
