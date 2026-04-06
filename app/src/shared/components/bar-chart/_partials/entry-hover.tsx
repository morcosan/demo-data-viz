interface Props extends ReactProps {
  visible: boolean
  x: number
  y: number
  width: number
  height: number
  radius: number
}

export const EntryHover = ({ ref, visible, x, y, width, height, radius }: Props) => {
  if (!visible) return null
  return (
    <rect
      ref={ref}
      x={0}
      y={y}
      width={width + x}
      height={height}
      rx={radius}
      fill="var(--ds-color-hover-text-default)"
    />
  )
}
