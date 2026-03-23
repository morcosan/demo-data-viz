import { TOKENS__SPACING } from '@ds/core'
import { Bar, CartesianGrid, BarChart as ReBarChart, Tooltip, XAxis, YAxis } from 'recharts'

export interface ChartEntry {
  name: string
  value: number
}

interface Props extends ReactProps {
  entries: ChartEntry[]
}

export const BarChart = (props: Props) => {
  const barHeight = parseFloat(TOKENS__SPACING['sm-1'].$value)
  const gapHeight = parseFloat(TOKENS__SPACING['xs-9'].$value)
  const chartHeight = props.entries.length * (barHeight + gapHeight) + 5 * gapHeight

  log(barHeight, gapHeight, chartHeight)

  return (
    <div className={cx('bg-color-bg-card w-full overflow-y-auto', props.className)} style={props.style}>
      <ReBarChart
        data={props.entries}
        layout="vertical"
        width="100%"
        height={chartHeight}
        barCategoryGap={0}
        responsive
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" fill="var(--ds-color-primary-card-text)" barSize={barHeight} />
      </ReBarChart>
    </div>
  )
}
