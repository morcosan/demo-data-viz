interface Props extends ReactProps {
  visible: boolean
  x: number
  y: number
  width: number
  height: number
  radius: number
}

export const EntryHover = (props: Props) => {
  if (!props.visible) return null
  return (
    <rect
      ref={props.ref}
      x={0}
      y={props.y}
      width={props.width + props.x}
      height={props.height}
      rx={props.radius}
      fill="var(--ds-color-hover-text-default)"
    />
  )
}
