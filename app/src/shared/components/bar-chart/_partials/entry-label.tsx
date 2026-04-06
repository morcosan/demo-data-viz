interface Props extends ReactProps {
  width: number
  height: number
  x: number
  y: number
  label: string
  chartSize: 'sm' | 'md' | 'lg'
}

export const EntryLabel = ({ x, y, height, label, chartSize, className }: Props) => {
  return (
    <foreignObject x={0} y={y - height / 2} width={x} height={height}>
      <div className={cx('pl-xs-5 pr-xs-5 h-full w-full overflow-hidden', 'flex items-center justify-end', className)}>
        <div className={cx('text-right', chartSize === 'sm' ? 'text-size-xs truncate' : 'text-size-sm line-clamp-2')}>
          {label}
        </div>
      </div>
    </foreignObject>
  )
}
