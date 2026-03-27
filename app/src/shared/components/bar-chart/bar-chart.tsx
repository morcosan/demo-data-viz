'use client'

import { computeTextWidth, formatNumber } from '@app/shared/utils/formatting'
import { Keyboard, TOKENS, useDefaults, useThemeService } from '@ds/core'
import { debounce } from 'lodash'
import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { EntryHover } from './_partials/entry-hover'
import { EntryLabel } from './_partials/entry-label'
import { EntryTooltip } from './_partials/entry-tooltip'

export type BarChartEntry = Record<string, number | string>
export type BarChartData = { entries: BarChartEntry[] } // Data wrapper required due to Storybook limitations

export interface BarChartProps extends ReactProps {
  data: BarChartData
  barNames: Record<string, string>
  entryKey: string
  entryFn?: (value: string, query: string) => ReactNode
  entryWidth?: number
  query?: string
}

export const BarChart = (rawProps: BarChartProps) => {
  const props = useDefaults(rawProps, {
    entryWidth: parseFloat(TOKENS.SPACING['md-5'].$value),
  })
  const { $fontSize } = useThemeService()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const hoverRef = useRef<Element | null>(null)
  const tooltipRef = useRef<Element | null>(null)
  const tooltipId = useId()
  const anyParam = {} as any

  const barKeys = Object.keys(props.barNames)
  const entries = props.data.entries.filter((entry) => barKeys.some((key) => typeof entry[key] === 'number'))
  const minEntryValue = Math.min(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const maxEntryValue = Math.max(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const hasBothSides = minEntryValue < 0 && maxEntryValue > 0

  const barLabelGap = 4 // px
  const barMarginLeft = minEntryValue < 0 ? computeTextWidth(formatNumber(minEntryValue), 12) + barLabelGap : 0
  const barMarginRight = maxEntryValue > 0 ? computeTextWidth(formatNumber(maxEntryValue), 12) + barLabelGap : 0
  const barSize = parseFloat(TOKENS.SPACING[barKeys.length > 1 ? 'sm-0' : 'sm-1'].$value)
  const barGap = parseFloat(TOKENS.SPACING['xs-1'].$value)
  const barRadius = parseFloat(TOKENS.RADIUS['sm'].$value)

  const entryGap = parseFloat(TOKENS.SPACING[barKeys.length > 1 ? 'xs-9' : 'xs-4'].$value)
  const entrySize = barKeys.length * (barSize + barGap) - barGap
  const entryHeight = entrySize + entryGap

  const xAxisHeight = 30 // px
  const chartPadding = 2 * entryGap
  const chartHeight = entries.length * (entrySize + entryGap) - entryGap + chartPadding + xAxisHeight

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
        height={chartHeight}
        barGap={barGap}
        aria-describedby={tooltipId} // Default a11y for recharts sucks
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
              offset={barLabelGap}
              className="text-size-xs fill-color-text-default"
              formatter={(value) => formatNumber(value as number)}
            />
          </Bar>
        ))}

        {/* AXIS */}
        <XAxis
          type="number"
          padding={{ left: barMarginLeft, right: barMarginRight }}
          tick={{ fontSize: $fontSize['sm'] }}
          tickFormatter={(value) => formatNumber(value)}
        />
        {hasBothSides && <ReferenceLine x={0} stroke="currentColor" strokeDasharray="3 3" />}
        <YAxis
          type="category"
          dataKey={props.entryKey}
          width={props.entryWidth}
          tick={
            <EntryLabel
              {...anyParam}
              width={props.entryWidth}
              height={entryHeight}
              labelFn={props.entryFn}
              query={props.query}
            />
          }
          tickLine={false}
        />

        {/* TOOLTIP */}
        <Tooltip
          active={true} // Always render content
          cursor={<EntryHover {...anyParam} ref={hoverRef} radius={barRadius} />}
          content={
            <EntryTooltip
              {...anyParam}
              visible={isFocused || isHovered}
              ref={tooltipRef}
              id={tooltipId}
              barNames={props.barNames}
              titleFn={props.entryFn}
            />
          }
        />
      </ReBarChart>
    </div>
  )
}
