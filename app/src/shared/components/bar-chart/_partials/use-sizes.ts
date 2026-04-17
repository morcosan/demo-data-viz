import { computeTextWidth, formatNumber } from '@app/shared/utils/formatting'
import { TOKENS } from '@ds/core'
import { type BarChartEntry, type BarChartSize } from '../_types'

interface Props {
  entries: BarChartEntry[]
  barKeys: string[]
  minEntryValue: number
  maxEntryValue: number
  chartSize?: BarChartSize
}

export const useSizes = (props: Props) => {
  const { barKeys, chartSize, entries, minEntryValue, maxEntryValue } = props

  const barLabelGap = (() => {
    if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-1'].$value)
    if (chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-2'].$value)
    if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-4'].$value)
    return 0
  })()
  const barMarginLeft = minEntryValue < 0 ? computeTextWidth(formatNumber(minEntryValue), 12) + barLabelGap : 0
  const barMarginRight = maxEntryValue > 0 ? computeTextWidth(formatNumber(maxEntryValue), 12) + barLabelGap : 0
  const barSize = (() => {
    if (barKeys.length > 1) {
      if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (chartSize === 'md') return parseFloat(TOKENS.SPACING['sm-1'].$value)
      if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-5'].$value)
    } else {
      if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (chartSize === 'md') return parseFloat(TOKENS.SPACING['sm-1'].$value)
      if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-5'].$value)
    }
    return 0
  })()
  const barGap = (() => {
    if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-0'].$value)
    if (chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-1'].$value)
    if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-2'].$value)
    return 0
  })()
  const barRadius = (() => {
    if (chartSize === 'sm') return parseFloat(TOKENS.RADIUS['xs'].$value)
    if (chartSize === 'md') return parseFloat(TOKENS.RADIUS['sm'].$value)
    if (chartSize === 'lg') return parseFloat(TOKENS.RADIUS['md'].$value)
    return 0
  })()
  const barStroke = (() => {
    if (chartSize === 'sm') return 1.5
    if (chartSize === 'md') return 2
    if (chartSize === 'lg') return 3
    return 0
  })()

  const entryGap = (() => {
    if (barKeys.length > 1) {
      if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-6'].$value)
      if (chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-9'].$value)
      if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['sm-2'].$value)
    } else {
      if (chartSize === 'sm') return parseFloat(TOKENS.SPACING['xs-1'].$value)
      if (chartSize === 'md') return parseFloat(TOKENS.SPACING['xs-2'].$value)
      if (chartSize === 'lg') return parseFloat(TOKENS.SPACING['xs-4'].$value)
    }
    return 0
  })()
  const entrySize = barKeys.length * (barSize + barGap) - barGap
  const entryHeight = entrySize + entryGap

  const xAxisHeight = 30 // px
  const chartPadding = 2 * entryGap
  const chartHeight = entries.length * (entrySize + entryGap) - entryGap + chartPadding + xAxisHeight

  return {
    barGap,
    barLabelGap,
    barMarginLeft,
    barMarginRight,
    barRadius,
    barSize,
    barStroke,
    chartHeight,
    entryHeight,
  }
}
