import { formatNumber } from '@app/shared/utils/formatting'
import { useThemeService, useViewportService } from '@ds/core'
import { type RefObject, useCallback, useId, useMemo } from 'react'
import * as Recharts from 'recharts'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type BarChartEntry, type BarChartProps } from '../_types'
import { EntryHover } from './entry-hover'
import { EntryLabel } from './entry-label'
import { Tooltip } from './tooltip'
import { useSizes } from './use-sizes'

interface Props extends BarChartProps {
  entries: BarChartEntry[]
  barKeys: string[]
  isHovered: boolean
  isFocused: boolean
  hoverRef: RefObject<Element | null>
  tooltipRef: RefObject<Element | null>
}

export const Canvas = (props: Props) => {
  const {
    barKeys,
    barNames,
    chartSize,
    entries,
    entryFn,
    entryKey,
    entryWidth,
    hoverRef,
    isFocused,
    isHovered,
    queries = [],
    tooltipRef,
  } = props
  const { isViewportMinSM } = useViewportService()
  const { $color, $fontSize } = useThemeService()
  const tooltipId = useId()
  const isTooltipVisible = isFocused || isHovered
  const minEntryValue = Math.min(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const maxEntryValue = Math.max(...entries.flatMap((entry) => barKeys.map((key) => Number(entry[key]) || 0)))
  const hasBothSides = minEntryValue < 0 && maxEntryValue > 0
  const sizes = useSizes({ entries, barKeys, minEntryValue, maxEntryValue, chartSize })
  const axisColor = $color['text-placeholder']

  const queryIndexes = useMemo(() => {
    const lcQueries = queries.map((q) => q.trim().toLowerCase()).filter(Boolean)
    return entries.reduce<number[]>((acc, entry, index) => {
      const entryValue = String(entry[entryKey]).toLowerCase()
      const matches = lcQueries.length === 0 || lcQueries.some((query) => entryValue.includes(query))
      return matches ? [...acc, index] : acc
    }, [])
  }, [entries, entryKey, queries])

  const getQueryClass = (index: number | string) => {
    const isMatch = queryIndexes.includes(parseInt(String(index)))
    return isMatch ? undefined : 'opacity-30'
  }

  const entryLabelFn = useCallback(
    (value?: string) => {
      value = value || ''
      const lcValue = value.toLowerCase()
      const query = queries.find((query) => lcValue.includes(query.toLowerCase())) || ''

      return entryFn ? entryFn(value, query) : <TextHighlight text={value} query={query} />
    },
    [entryFn, queries],
  )

  return (
    <Recharts.BarChart
      data={entries}
      layout="vertical"
      width="100%"
      height={sizes.chartHeight}
      barGap={sizes.barGap}
      aria-describedby={tooltipId} // Default a11y for recharts sucks
      className="min-w-xl-2 [&_g]:outline-none [&_svg]:outline-none"
      responsive
    >
      {/* BARS */}
      {barKeys.map((key) => (
        <Recharts.Bar
          key={key}
          dataKey={key}
          barSize={sizes.barSize}
          radius={[0, sizes.barRadius, sizes.barRadius, 0]}
          shape={(params: any) => (
            <Recharts.Rectangle
              {...params}
              className={cx(
                'fill-color-chart-bar-default hover:fill-color-chart-bar-hover',
                getQueryClass(params.index),
              )}
            />
          )}
        >
          {isViewportMinSM && (
            <Recharts.LabelList
              dataKey={key}
              content={(params: any) => (
                <text
                  x={params.x + params.width + (params.value < 0 ? -sizes.barLabelGap : sizes.barLabelGap)}
                  y={params.y + params.height / 2}
                  textAnchor={params.value < 0 ? 'end' : 'start'}
                  dominantBaseline="central"
                  className={cx('text-size-xs fill-color-text-default font-family-mono', getQueryClass(params.index))}
                >
                  {formatNumber(params.value)}
                </text>
              )}
            />
          )}
        </Recharts.Bar>
      ))}

      {/* AXIS */}
      <Recharts.XAxis
        type="number"
        padding={isViewportMinSM ? { left: sizes.barMarginLeft, right: sizes.barMarginRight } : undefined}
        axisLine={{ stroke: axisColor }}
        tickLine={{ stroke: axisColor }}
        tick={{ fontSize: $fontSize['sm'], fill: axisColor }}
        tickFormatter={(value) => formatNumber(value)}
      />
      {hasBothSides && <Recharts.ReferenceLine x={0} stroke={axisColor} strokeDasharray="3 3" />}
      <Recharts.YAxis
        type="category"
        dataKey={entryKey}
        width={entryWidth}
        axisLine={{ stroke: axisColor }}
        interval={0}
        tickLine={false}
        tickSize={0}
        tickMargin={0}
        tick={(params: any) => (
          <EntryLabel
            {...params}
            label={entryLabelFn(params.payload.value) || params.payload.value}
            height={sizes.entryHeight}
            chartSize={chartSize}
            className={getQueryClass(params.index)}
          />
        )}
      />

      {/* TOOLTIP */}
      <Recharts.Tooltip
        active={true} // Always render content
        cursor={<EntryHover {...({} as any)} visible={isTooltipVisible} ref={hoverRef} radius={sizes.barRadius} />}
        content={(params: any) => (
          <Tooltip
            {...params}
            visible={isTooltipVisible}
            ref={tooltipRef}
            id={tooltipId}
            barNames={barNames}
            labelFn={(value) => entryLabelFn(value)}
          />
        )}
      />
    </Recharts.BarChart>
  )
}
