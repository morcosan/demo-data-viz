import { TOKENS__SPACING } from '@ds/core'
import { Bar, LabelList, BarChart as ReBarChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Label } from './_partials/label'

interface Props extends ReactProps {
  entries: object[]
  labelKey: string
  valueKeys: string[]
}

export const BarChart = (props: Props) => {
  const labelSize = parseFloat(TOKENS__SPACING['md-5'].$value)
  const barSize = parseFloat(TOKENS__SPACING['sm-1'].$value)
  const barGap = parseFloat(TOKENS__SPACING['xs-1'].$value)
  const groupGap = parseFloat(TOKENS__SPACING['xs-9'].$value)
  const xAxisHeight = 30
  const groupSize = props.valueKeys.length * (barSize + barGap) - barGap
  const padding = 2 * groupSize
  const totalHeight = props.entries.length * (groupSize + groupGap) - groupGap + padding + xAxisHeight

  return (
    <div className={cx('bg-color-bg-card w-full overflow-y-auto', props.className)} style={props.style}>
      <ReBarChart data={props.entries} layout="vertical" width="100%" height={totalHeight} barGap={barGap} responsive>
        {/* BARS */}
        {props.valueKeys.map((key) => (
          <Bar key={key} dataKey={key} fill="var(--ds-color-primary-card-text)" barSize={barSize}>
            <LabelList dataKey={key} position="insideRight" />
          </Bar>
        ))}

        {/* AXIS */}
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey={props.labelKey}
          width={labelSize}
          tick={<Label width={labelSize} height={groupSize} />}
        />

        <Tooltip />
      </ReBarChart>
    </div>
  )
}
