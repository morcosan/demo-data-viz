import { BarCursor } from '@app/shared/components/bar-chart/_partials/bar-cursor'
import { Keyboard, TOKENS } from '@ds/core'
import { type ReactNode } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, Tooltip, XAxis, YAxis, type RenderableText } from 'recharts'
import { BarInfo } from './_partials/bar-info'
import { BarLabel } from './_partials/bar-label'

export interface BarChartProps extends ReactProps {
  data: { entries: object[] } // Data wrapper required due to Storybook limitations
  labelKey: string
  valueKeys: string[]
  labelFn?: (value: string) => ReactNode
}

export const BarChart = (props: BarChartProps) => {
  const { entries } = props.data
  const hasGroups = props.valueKeys.length > 1
  const barRadius = parseFloat(TOKENS.RADIUS['sm'].$value)
  const xAxisHeight = 30
  const barPadding = parseFloat(TOKENS.SPACING['xs-2'].$value)
  const barSize = parseFloat(TOKENS.SPACING[hasGroups ? 'sm-0' : 'sm-1'].$value)
  const barGap = parseFloat(TOKENS.SPACING['xs-1'].$value)
  const groupGap = parseFloat(TOKENS.SPACING[hasGroups ? 'xs-9' : 'xs-4'].$value)
  const groupSize = props.valueKeys.length * (barSize + barGap) - barGap
  const padding = 2 * groupGap
  const totalHeight = entries.length * (groupSize + groupGap) - groupGap + padding + xAxisHeight
  const labelWidth = parseFloat(TOKENS.SPACING['md-5'].$value)
  const labelHeight = groupSize + groupGap
  const propParam = {} as any
  const barValueFn = (key: string, value: RenderableText) => (hasGroups ? `${key}: ${value}` : value)

  // Swap left/right arrows for tab navigation
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (!event.isTrusted) return
    if (![Keyboard.ARROW_RIGHT, Keyboard.ARROW_LEFT].includes(event.key)) return
    event.stopPropagation()
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', {
        ...event.nativeEvent,
        key: event.key === Keyboard.ARROW_RIGHT ? Keyboard.ARROW_LEFT : Keyboard.ARROW_RIGHT,
        bubbles: true,
        cancelable: true,
      }),
    )
  }

  return (
    <div
      className={cx('bg-color-bg-card a11y-outline-proxy p-xs-1 w-full overflow-y-auto', props.className)}
      style={props.style}
      onKeyDownCapture={handleKeyDown}
    >
      <ReBarChart
        data={entries}
        layout="vertical"
        width="100%"
        height={totalHeight}
        barGap={barGap}
        margin={{ top: 0, right: barPadding, bottom: 0, left: 0 }}
        className="[&_g]:outline-none [&_svg]:outline-none"
        responsive
      >
        {/* BARS */}
        {props.valueKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            barSize={barSize}
            radius={[0, barRadius, barRadius, 0]}
            className="fill-color-chart-bar-default hover:fill-color-chart-bar-hover"
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
          tick={<BarLabel {...propParam} width={labelWidth} height={labelHeight} labelFn={props.labelFn} />}
        />

        {/* TOOLTIP */}
        <Tooltip
          cursor={<BarCursor {...propParam} padding={barPadding} radius={barRadius} />}
          content={<BarInfo {...propParam} labelFn={props.labelFn} />}
        />
      </ReBarChart>
    </div>
  )
}
