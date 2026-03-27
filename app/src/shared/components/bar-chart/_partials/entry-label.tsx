interface Props extends ReactProps {
  width: number
  height: number
  x: number
  y: number
  label: string
}

export const EntryLabel = (props: Props) => {
  return (
    <foreignObject x={0} y={props.y - props.height / 2} width={props.width} height={props.height}>
      <div
        className={cx(
          'pl-xs-5 pr-xs-4 h-full w-full overflow-hidden',
          'flex items-center justify-end',
          props.className,
        )}
      >
        <div className="text-size-sm line-clamp-2 text-right leading-1">{props.label}</div>
      </div>
    </foreignObject>
  )
}
