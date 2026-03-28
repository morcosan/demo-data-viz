'use client'

import { TextHighlight } from '@app-components'
import { computeTextWidth, formatNumber } from '@app/shared/utils/formatting'
import { TOKENS, useDefaults, useThemeService, useViewportService } from '@ds/core'
import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Bar, LabelList, BarChart as ReBarChart, Rectangle, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts'
import { EntryHover } from './_partials/entry-hover'
import { EntryLabel } from './_partials/entry-label'
import { EntryTooltip } from './_partials/entry-tooltip'
import { Toolbar } from './_partials/toolbar'
import { useEvents } from './_partials/use-events'

export type BarChartEntry = Record<string, number | string>
export type BarChartData = { entries: BarChartEntry[] } // Data wrapper required due to Storybook limitations

export interface BarChartProps extends ReactProps {
  data: BarChartData
  barNames: Record<string, string>
  entryKey: string
  entryName: string
  entryFn?: (value: string, query: string) => ReactNode
  entryWidth?: number
  query?: string
  toolbar?: ReactNode
}

export const BarChart = (rawProps: BarChartProps) => {
  const props = useDefaults(rawProps, {
    entryWidth: parseFloat(TOKENS.SPACING['md-5'].$value),
    query: '',
  })
  const { isViewportMinSM } = useViewportService()
  const { $fontSize } = useThemeService()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | false>(false)
  const hoverRef = useRef<Element | null>(null)
  const tooltipRef = useRef<Element | null>(null)
  const tooltipId = useId()
  const { handleKeyDown } = useEvents(hoverRef, tooltipRef)

  const barKeys = Object.keys(props.barNames)
  const entries = useMemo(() => {
    const filtered = props.data.entries.filter((entry) => barKeys.some((key) => typeof entry[key] === 'number'))

    if (!sortKey || !sortDir) return filtered

    return filtered.sort((a, b) => {
      const numA = a[sortKey]
      const numB = b[sortKey]
      const strA = String(a[sortKey] ?? '')
      const strB = String(b[sortKey] ?? '')

      return typeof numA === 'number' && typeof numB === 'number'
        ? sortDir === 'asc'
          ? numA - numB
          : numB - numA
        : sortDir === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA)
    })
  }, [props.data.entries, barKeys, sortKey, sortDir])

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

  const queryIndexes = useMemo(() => {
    const lcQuery = props.query!.trim().toLowerCase()
    return entries.reduce<number[]>((acc, entry, index) => {
      return !lcQuery || String(entry[props.entryKey]).toLowerCase().includes(lcQuery) ? [...acc, index] : acc
    }, [])
  }, [entries, props.entryKey, props.query])

  const getQueryClass = (index: number | string) => {
    const isMatch = queryIndexes.includes(parseInt(String(index)))
    return isMatch ? undefined : 'opacity-30'
  }

  const entryLabelFn = useCallback(
    (value?: string) => {
      value = value || ''
      return props.entryFn ? props.entryFn(value, props.query!) : <TextHighlight text={value} query={props.query!} />
    },
    [props.entryFn, props.query],
  )

  const toggleSort = (key: string) => {
    const mainDir = key === props.entryKey ? 'asc' : 'desc'
    const secDir = key === props.entryKey ? 'desc' : 'asc'
    const otherDir = sortDir === mainDir ? secDir : sortDir === secDir ? false : mainDir
    setSortKey(key)
    setSortDir(sortKey === key ? otherDir : mainDir)
  }

  return (
    <div className={cx('bg-color-bg-card flex w-full flex-col', props.className)} style={props.style}>
      <Toolbar
        barNames={props.barNames}
        entryKey={props.entryKey}
        entryName={props.entryName}
        entryWidth={props.entryWidth!}
        sortKey={sortKey}
        sortDir={sortDir}
        toolbar={props.toolbar}
        className="p-xs-1"
        onSort={toggleSort}
      />

      {/* CHART */}
      <div
        className="a11y-outline-proxy p-xs-1 min-h-0 flex-1 overflow-auto"
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
                      dominantBaseline="middle"
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
            tick={{ fontSize: $fontSize['sm'] }}
            tickFormatter={(value) => formatNumber(value)}
          />
          {hasBothSides && <ReferenceLine x={0} stroke="currentColor" strokeDasharray="3 3" />}
          <YAxis
            type="category"
            dataKey={props.entryKey}
            width={props.entryWidth}
            tickLine={false}
            tickSize={0}
            tickMargin={0}
            tick={(params: any) => (
              <EntryLabel
                {...params}
                label={entryLabelFn(params.payload.value) || params.payload.value}
                height={entryHeight}
                className={getQueryClass(params.index)}
              />
            )}
          />

          {/* TOOLTIP */}
          <Tooltip
            active={true} // Always render content
            cursor={<EntryHover {...({} as any)} visible={isFocused || isHovered} ref={hoverRef} radius={barRadius} />}
            content={(params: any) => {
              return (
                <EntryTooltip
                  {...params}
                  visible={isFocused || isHovered}
                  ref={tooltipRef}
                  id={tooltipId}
                  barNames={props.barNames}
                  labelFn={(value) => entryLabelFn(value)}
                />
              )
            }}
          />
        </ReBarChart>
      </div>
    </div>
  )
}
