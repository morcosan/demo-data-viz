import type { CartesianTickItem } from 'recharts/types/util/types'

interface Props {
  width: number
  height: number
  x?: number
  y?: number
  payload?: CartesianTickItem
}

export const Label = (props: Props) => {
  const posY = (props.y || 0) - props.height / 2
  const label = props.payload?.value

  return (
    <foreignObject x={0} y={posY} width={props.width} height={props.height}>
      <div className="pl-xs-5 pr-xs-2 flex h-full w-full items-center overflow-hidden">{label}</div>
    </foreignObject>
  )
}
