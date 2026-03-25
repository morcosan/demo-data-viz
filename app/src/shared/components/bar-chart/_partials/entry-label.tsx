import type { ReactNode } from 'react'
import type { CartesianTickItem } from 'recharts/types/util/types'

interface Props {
  width: number
  height: number
  x: number
  y: number
  payload: CartesianTickItem
  labelFn?: (value: string, query: string) => ReactNode
  query?: string
}

export const EntryLabel = (props: Props) => {
  const posY = props.y - props.height / 2
  const label = props.payload?.value

  return (
    <foreignObject x={0} y={posY} width={props.width} height={props.height}>
      <div className="pl-xs-5 pr-xs-4 flex h-full w-full items-center justify-end overflow-hidden">
        <div className="text-size-sm line-clamp-2 text-right leading-1">
          {props.labelFn?.(label, props.query || '') || label}
        </div>
      </div>
    </foreignObject>
  )
}
