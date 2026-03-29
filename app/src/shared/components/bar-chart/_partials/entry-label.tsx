interface Props extends ReactProps {
  width: number
  height: number
  x: number
  y: number
  label: string
  chartSize: 'sm' | 'md' | 'lg'
}

export const EntryLabel = (props: Props) => {
  return (
    <foreignObject x={0} y={props.y - props.height / 2} width={props.x} height={props.height}>
      <div
        className={cx(
          'pl-xs-5 pr-xs-5 h-full w-full overflow-hidden',
          'flex items-center justify-end',
          props.className,
        )}
      >
        <div
          className={cx(
            'text-right leading-1',
            props.chartSize === 'sm' ? 'text-size-xs truncate' : 'text-size-sm line-clamp-2',
          )}
        >
          {props.label}
        </div>
      </div>
    </foreignObject>
  )
}
