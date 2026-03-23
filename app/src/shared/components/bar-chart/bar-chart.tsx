import { TOKENS } from '@ds/core'
import { type ReactNode } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, Tooltip, XAxis, YAxis, type RenderableText } from 'recharts'
import { Label } from './_partials/label'

export interface BarChartProps extends ReactProps {
  data: { entries: object[] } // Data wrapper required due to Storybook limitations
  labelKey: string
  valueKeys: string[]
  labelFn?: (value: string) => ReactNode
}

export const BarChart = (props: BarChartProps) => {
  const { entries } = props.data
  const hasGroups = props.valueKeys.length > 1
  const barRadius = parseFloat(TOKENS.RADIUS['md'].$value)
  const xAxisHeight = 30
  const barSize = parseFloat(TOKENS.SPACING[hasGroups ? 'sm-0' : 'sm-1'].$value)
  const barGap = parseFloat(TOKENS.SPACING['xs-1'].$value)
  const groupGap = parseFloat(TOKENS.SPACING[hasGroups ? 'xs-9' : 'xs-4'].$value)
  const groupSize = props.valueKeys.length * (barSize + barGap) - barGap
  const padding = 2 * groupSize
  const totalHeight = entries.length * (groupSize + groupGap) - groupGap + padding + xAxisHeight
  const labelWidth = parseFloat(TOKENS.SPACING['md-5'].$value)
  const labelHeight = groupSize + groupGap

  const barValueFn = (key: string, value: RenderableText) => (hasGroups ? `${key}: ${value}` : value)

  return (
    <div className={cx('bg-color-bg-card w-full overflow-y-auto', props.className)} style={props.style}>
      <ReBarChart data={entries} layout="vertical" width="100%" height={totalHeight} barGap={barGap} responsive>
        {/* BARS */}
        {props.valueKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            barSize={barSize}
            radius={[0, barRadius, barRadius, 0]}
            className="fill-color-border-active"
          >
            <LabelList
              dataKey={key}
              position="insideRight"
              offset={8}
              className="text-size-sm fill-color-text-inverse"
              formatter={(value) => barValueFn(key, value)}
            />
          </Bar>
        ))}

        {/* AXIS */}
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey={props.labelKey}
          width={labelWidth}
          tick={<Label width={labelWidth} height={labelHeight} labelFn={props.labelFn} />}
        />

        <Tooltip />
      </ReBarChart>
    </div>
  )
}
