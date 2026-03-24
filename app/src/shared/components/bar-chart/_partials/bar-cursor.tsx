interface Props {
  x: number
  y: number
  width: number
  height: number
  padding: number
  radius: number
}

export const BarCursor = (props: Props) => {
  return (
    <rect
      x={0}
      y={props.y}
      width={props.width + props.x + props.padding}
      height={props.height}
      rx={props.radius}
      fill="var(--ds-color-hover-text-default)"
    />
  )
}
