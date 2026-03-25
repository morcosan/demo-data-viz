import { formatNumber } from '@app/shared/utils/formatting'
import { Keyboard, TOKENS } from '@ds/core'
import { debounce } from 'lodash'
import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, Tooltip, XAxis, YAxis } from 'recharts'
import { EntryHover } from './_partials/entry-hover'
import { EntryLabel } from './_partials/entry-label'
import { EntryTooltip } from './_partials/entry-tooltip'

export type BarChartEntry = Record<string, number | string>

export interface BarChartProps extends ReactProps {
  data: { entries: BarChartEntry[] } // Data wrapper required due to Storybook limitations
  barLabels: Record<string, string>
  labelKey: string
  labelFn?: (value: string) => ReactNode
}

export const BarChart = (props: BarChartProps) => {
  const { entries } = props.data
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hoverRef = useRef<Element | null>(null)
  const tooltipRef = useRef<Element | null>(null)
  const tooltipId = useId()
  const barKeys = Object.keys(props.barLabels)
  const hasGroups = barKeys.length > 1
  const barRadius = parseFloat(TOKENS.RADIUS['sm'].$value)
  const xAxisHeight = 30
  const barPadding = parseFloat(TOKENS.SPACING['xs-2'].$value)
  const barSize = parseFloat(TOKENS.SPACING[hasGroups ? 'sm-0' : 'sm-1'].$value)
  const barGap = parseFloat(TOKENS.SPACING['xs-1'].$value)
  const groupGap = parseFloat(TOKENS.SPACING[hasGroups ? 'xs-9' : 'xs-4'].$value)
  const groupSize = barKeys.length * (barSize + barGap) - barGap
  const padding = 2 * groupGap
  const totalHeight = entries.length * (groupSize + groupGap) - groupGap + padding + xAxisHeight
  const labelWidth = parseFloat(TOKENS.SPACING['md-5'].$value)
  const labelHeight = groupSize + groupGap
  const propParam = {} as any

  const scrollToView = useMemo(() => {
    return debounce(() => {
      hoverRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      tooltipRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 300)
  }, [])

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
    scrollToView()
  }

  return (
    <div
      className={cx('bg-color-bg-card a11y-outline-proxy p-xs-1 w-full overflow-y-auto', props.className)}
      style={props.style}
      onKeyDownCapture={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ReBarChart
        data={entries}
        layout="vertical"
        width="100%"
        height={totalHeight}
        barGap={barGap}
        aria-describedby={tooltipId} // Default a11y for recharts sucks
        margin={{ top: 0, right: barPadding, bottom: 0, left: 0 }}
        className="[&_g]:outline-none [&_svg]:outline-none"
        responsive
      >
        {/* BARS */}
        {barKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            barSize={barSize}
            radius={[0, barRadius, barRadius, 0]}
            className="fill-color-chart-bar-default hover:fill-color-chart-bar-hover"
          >
            <LabelList
              dataKey={key}
              position="right"
              offset={8}
              className="text-size-xs fill-color-text-default"
              formatter={(value) => formatNumber(value as number)}
            />
          </Bar>
        ))}

        {/* AXIS */}
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey={props.labelKey}
          width={labelWidth}
          tick={<EntryLabel {...propParam} width={labelWidth} height={labelHeight} labelFn={props.labelFn} />}
        />

        {/* TOOLTIP */}
        <Tooltip
          active={true} // Always render content
          cursor={<EntryHover {...propParam} ref={hoverRef} padding={barPadding} radius={barRadius} />}
          content={
            <EntryTooltip
              {...propParam}
              visible={isFocused || isHovered}
              ref={tooltipRef}
              id={tooltipId}
              barLabels={props.barLabels}
              labelFn={props.labelFn}
            />
          }
        />
      </ReBarChart>
    </div>
  )
}
