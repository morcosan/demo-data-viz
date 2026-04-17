import { useCountries, useTranslation } from '@app-i18n'
import { formatInt, formatNumber } from '@app/shared/utils/formatting'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TextHighlight } from '../../text-highlight/text-highlight'
import { type ChoroplethProps, type EChartsOption, type ECityItem, type ECountryItem, type EItem } from '../_types'
import { Tooltip } from './tooltip'
import { useCities } from './use-cities'
import { useEcharts } from './use-echarts'
import { useStyles } from './use-styles'

export const Chart = (props: ChoroplethProps) => {
  const { data, view = 'world', queries = [], className } = props
  const { t } = useTranslation()
  const { getCountryNames, getCountryIso2 } = useCountries()
  const { colors, styles, cssContainer, draggingClass, viewConfigs, getCitySize } = useStyles()
  const { geoCities, loadCities, getGeoCity } = useCities()
  const containerRef = useRef<HTMLDivElement>(null)

  const minValue = Math.min(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const maxValue = Math.max(...data.countries.map((c) => c.value), ...data.cities.map((c) => c.value))
  const hasOpposites = minValue < 0 && maxValue > 0
  const absMaxValue = Math.max(Math.abs(minValue), Math.abs(maxValue))
  const legendMinValue = hasOpposites ? -absMaxValue : minValue
  const legendMaxValue = hasOpposites ? absMaxValue : maxValue
  const hasDigits = maxValue <= 10 && minValue >= -10
  const legendMinLabel = hasDigits ? formatNumber(legendMinValue) : formatInt(legendMinValue, 'down')
  const legendMaxLabel = hasDigits ? formatNumber(legendMaxValue) : formatInt(legendMaxValue, 'up')
  const legendFn = (value: number) => (hasDigits ? formatNumber(value) : formatInt(value))

  const lcQueries = useMemo(() => queries.map((query) => query.trim().toLowerCase()).filter(Boolean), [queries])
  const queryNames = useMemo(() => {
    const names = [] as string[]
    data.countries.forEach((country) => {
      const name = country.name.toLowerCase()
      const isMatch = !lcQueries.length || lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(country.name)
    })
    data.cities.forEach((city) => {
      const name = city.name.toLowerCase()
      const isMatch = !lcQueries.length || lcQueries.some((query) => name.includes(query))
      if (isMatch) names.push(city.name)
    })
    return names
  }, [data.countries, data.cities, lcQueries])

  const countryItems = useMemo((): ECountryItem[] => {
    return data.countries.flatMap((country) => {
      return getCountryNames(getCountryIso2(country.name)).map((name) => ({
        name,
        value: country.value,
        match: queryNames.includes(country.name),
      }))
    })
  }, [data.countries, queryNames, getCountryNames, getCountryIso2])

  const cityItems = useMemo(() => {
    return data.cities.flatMap((city): ECityItem[] => {
      const geoCity = getGeoCity(city)
      if (!geoCity) return []
      return [
        {
          name: city.name,
          value: [geoCity.lng, geoCity.lat, city.value],
          iso2: geoCity.iso2,
          area: city.area,
          match: queryNames.includes(city.name),
        },
      ]
    })
  }, [data.cities, queryNames, getGeoCity])

  const onDragging = useCallback(
    (active: boolean) => {
      const classList = containerRef.current?.classList
      active ? classList?.add(draggingClass) : classList?.remove(draggingClass)
    },
    [draggingClass],
  )
  const { chartRef } = useEcharts({ containerRef, countryItems, cityItems, getCitySize, onDragging })

  const nameFn = useCallback(
    (name: string, iso2: string) => {
      const lcName = name.toLowerCase()
      const query = lcQueries?.find((query) => lcName.includes(query)) || ''
      const text = query ? <TextHighlight text={name} query={query} /> : name
      const flag = iso2.toLowerCase()
      return flag ? (
        <div className="flex items-center">
          {text}
          {<span className={cx(`fi fi-${flag} ml-xs-2 mb-px shadow-xs`)} />}
        </div>
      ) : (
        <span title={name}>{text}</span>
      )
    },
    [lcQueries],
  )

  const isItemOther = (item: EItem) => !item.match && lcQueries.length > 0
  const mapOtherItemStyle = (item: EItem) => ({ ...item, itemStyle: styles.mapItem.queryOther })
  const mapActiveItemStyle = (item: EItem) => ({
    ...item,
    itemStyle: isItemOther(item)
      ? { opacity: 0 }
      : lcQueries.length
        ? styles.mapItem.queryActive
        : styles.mapItem.default,
  })

  const updateChart = () => {
    chartRef.current?.setOption({
      animation: false,
      // Echarts bug: visualMap colors ignore seriesIndex
      // Echarts bug: only opacity can be overwritten, not areaColor/color
      visualMap: {
        ...styles.legend,
        seriesIndex: [0, 1],
        max: legendMaxValue,
        min: legendMinValue,
        text: [legendMaxLabel, legendMinLabel],
        inRange: { color: [colors.valueMin, colors.valueMax] },
        formatter: legendFn as any,
        zlevel: 100,
      },
      series: [
        {
          data: countryItems,
          type: 'map',
          map: 'world',
          geoIndex: 0,
          selectedMode: false,
        },
        {
          zlevel: 3,
          data: cityItems.map(mapActiveItemStyle),
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: getCitySize(viewConfigs[view].zoom),
          emphasis: { itemStyle: styles.mapItem.hover },
        },
        {
          zlevel: 2,
          data: cityItems.filter(isItemOther).map(mapOtherItemStyle),
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: getCitySize(viewConfigs[view].zoom),
        },
      ],
      geo: [
        {
          ...viewConfigs[view],
          zlevel: 1,
          map: 'world',
          roam: true,
          regions: countryItems.map(mapActiveItemStyle),
          emphasis: { itemStyle: styles.mapItem.hover, label: { show: false } },
        },
        {
          ...viewConfigs[view],
          zlevel: 0,
          map: 'world',
          silent: true,
          regions: countryItems.filter(isItemOther).map(mapOtherItemStyle),
          itemStyle: styles.mapItem.landscape,
        },
      ],
      tooltip: {
        ...styles.tooltip,
        trigger: 'item',
        confine: true,
        formatter: (item: any & EItem) => {
          const value = Array.isArray(item.value) ? item.value[2] : item.value
          const iso2 = Array.isArray(item.value)
            ? item.data?.iso2 || getGeoCity(item)?.iso2 || ''
            : getCountryIso2(item.name)
          return renderToStaticMarkup(<Tooltip name={item.name} nameFn={nameFn} iso2={iso2} value={value} />)
        },
      },
    } satisfies EChartsOption)
  }

  useEffect(() => {
    data.cities.length && loadCities()
    updateChart()
  }, [view, countryItems, cityItems, geoCities])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label={t('dataViz.notice.mapAriaLabel', {
        countryCount: data.countries.length,
        cityCount: data.cities.length,
      })}
      className={className}
      css={cssContainer}
    />
  )
}
