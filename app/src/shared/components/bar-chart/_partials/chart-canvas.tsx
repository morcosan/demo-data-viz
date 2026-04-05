import { computeTextWidth, formatNumber } from '@app/shared/utils/formatting'
import { TOKENS, useThemeService, useViewportService } from '@ds/core'
import { type RefObject, useCallback, useId, useMemo } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, Rectangle, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type BarChartEntry, type BarChartProps } from '../_types'
import { EntryHover } from './entry-hover'
import { EntryLabel } from './entry-label'
import { EntryTooltip } from './entry-tooltip'

interface Props extends BarChartProps {
  entries: BarChartEntry[]
  barKeys: string[]
  isHovered: boolean
  isFocused: boolean
  hoverRef: RefObject<Element | null>
  tooltipRef: RefObject<Element | null>
}

export const ChartCanvas = (props: Props) => {
  const { entries, barKeys } = props
  const { isViewportMinSM } = useViewportService()
  const { $color, $fontSize } = useThemeService()
  const tooltipId = useId()
  const isTooltipVisible = props.isFocused || props.isHovered

  const axisColor = $color['text-placeholder']

  const minEntryValue = Math.min(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const maxEntryValue = Math.max(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const hasBothSides = minEntryValue < 0 && maxEntryValue > 0

  const barLabelGap = (() => {
    if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-1'].$value)
    if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-2'].$value)
    if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-4'].$value)
    return 0
  })()
  const barMarginLeft = minEntryValue < 0 ? computeTextWidth(formatNumber(minEntryValue), 12) + barLabelGap : 0
  const barMarginRight = maxEntryValue > 0 ? computeTextWidth(formatNumber(maxEntryValue), 12) + barLabelGap : 0
  const barSize = (() => {
    if (barKeys.length > 1) {
      if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['sm-1'].$value)
      if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-5'].$value)
    } else {
      if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['sm-1'].$value)
      if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-5'].$value)
    }
    return 0
  })()
  const barGap = (() => {
    if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-0'].$value)
    if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-1'].$value)
    if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-2'].$value)
    return 0
  })()
  const barRadius = (() => {
    if (props.chartSize === 'sm') return parseFloat(TOKENS.RADIUS['xs'].$value)
    if (props.chartSize === 'md') return parseFloat(TOKENS.RADIUS['sm'].$value)
    if (props.chartSize === 'lg') return parseFloat(TOKENS.RADIUS['md'].$value)
    return 0
  })()

  const entryGap = (() => {
    if (barKeys.length > 1) {
      if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-6'].$value)
      if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-2'].$value)
    } else {
      if (props.chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-1'].$value)
      if (props.chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-2'].$value)
      if (props.chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-4'].$value)
    }
    return 0
  })()
  const entrySize = barKeys.length * (barSize + barGap) - barGap
  const entryHeight = entrySize + entryGap

  const xAxisHeight = 30 // px
  const chartPadding = 2 * entryGap
  const chartHeight = entries.length * (entrySize + entryGap) - entryGap + chartPadding + xAxisHeight

  const queryIndexes = useMemo(() => {
    const lcQueries = props.queries?.map((q) => q.trim().toLowerCase()).filter(Boolean) ?? []
    return entries.reduce<number[]>((acc, entry, index) => {
      const entryValue = String(entry[props.entryKey]).toLowerCase()
      const matches = lcQueries.length === 0 || lcQueries.some((query) => entryValue.includes(query))
      return matches ? [...acc, index] : acc
    }, [])
  }, [entries, props.entryKey, props.queries])

  const getQueryClass = (index: number | string) => {
    const isMatch = queryIndexes.includes(parseInt(String(index)))
    return isMatch ? undefined : 'opacity-30'
  }

  const entryLabelFn = useCallback(
    (value?: string) => {
      value = value || ''
      const lcValue = value.toLowerCase()
      const query = props.queries?.find((query) => lcValue.includes(query.toLowerCase())) || ''

      return props.entryFn ? props.entryFn(value, query) : <TextHighlight text={value} query={query} />
    },
    [props.entryFn, props.queries],
  )

  return (
    <ReBarChart
      data={entries}
      layout="vertical"
      width="100%"
      height={chartHeight}
      barGap={barGap}
      aria-describedby={tooltipId} // Default a11y for recharts sucks
      className="min-w-xl-2 [&_g]:outline-none [&_svg]:outline-none"
      responsive
    >
      {/* BARS */}
      {barKeys.map((key) => (
        <Bar
          key={key}
          dataKey={key}
          barSize={barSize}
          radius={[0, barRadius, barRadius, 0]}
          shape={(params: any) => (
            <Rectangle
              {...params}
              className={cx(
                'fill-color-chart-bar-default hover:fill-color-chart-bar-hover',
                getQueryClass(params.index),
              )}
            />
          )}
        >
          {isViewportMinSM && (
            <LabelList
              dataKey={key}
              content={(params: any) => (
                <text
                  x={params.x + params.width + (params.value < 0 ? -barLabelGap : barLabelGap)}
                  y={params.y + params.height / 2}
                  textAnchor={params.value < 0 ? 'end' : 'start'}
                  dominantBaseline="central"
                  className={cx('text-size-xs fill-color-text-default', getQueryClass(params.index))}
                >
                  {formatNumber(params.value)}
                </text>
              )}
            />
          )}
        </Bar>
      ))}

      {/* AXIS */}
      <XAxis
        type="number"
        padding={isViewportMinSM ? { left: barMarginLeft, right: barMarginRight } : undefined}
        axisLine={{ stroke: axisColor }}
        tickLine={{ stroke: axisColor }}
        tick={{ fontSize: $fontSize['sm'], fill: axisColor }}
        tickFormatter={(value) => formatNumber(value)}
      />
      {hasBothSides && <ReferenceLine x={0} stroke={axisColor} strokeDasharray="3 3" />}
      <YAxis
        type="category"
        dataKey={props.entryKey}
        width={props.entryWidth}
        axisLine={{ stroke: axisColor }}
        interval={0}
        tickLine={false}
        tickSize={0}
        tickMargin={0}
        tick={(params: any) => (
          <EntryLabel
            {...params}
            label={entryLabelFn(params.payload.value) || params.payload.value}
            height={entryHeight}
            chartSize={props.chartSize}
            className={getQueryClass(params.index)}
          />
        )}
      />

      {/* TOOLTIP */}
      <Tooltip
        active={true} // Always render content
        cursor={<EntryHover {...({} as any)} visible={isTooltipVisible} ref={props.hoverRef} radius={barRadius} />}
        content={(params: any) => {
          return (
            <EntryTooltip
              {...params}
              visible={isTooltipVisible}
              ref={props.tooltipRef}
              id={tooltipId}
              barNames={props.barNames}
              labelFn={(value) => entryLabelFn(value)}
            />
          )
        }}
      />
    </ReBarChart>
  )
}
