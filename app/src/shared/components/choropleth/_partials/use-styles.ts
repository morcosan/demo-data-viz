import { getTokenValue_COLOR, getTokenValue_FONT_FAMILY, useThemeService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { useCallback, useMemo } from 'react'
import { type EItemStyle, type ELegend, type ETooltip } from '../_types'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()
  const draggingClass = 'choropleth-dragging'
  const tooltipClass = 'choropleth-tooltip'

  const colors = useMemo(
    () => ({
      text: getTokenValue_COLOR('text-default', colorTheme),
      valueNone: getTokenValue_COLOR('map-value-none', colorTheme),
      valueMin: getTokenValue_COLOR('map-value-min', colorTheme),
      valueMax: getTokenValue_COLOR('map-value-max', colorTheme),
      land: getTokenValue_COLOR('map-land', colorTheme),
      ocean: getTokenValue_COLOR('map-ocean', colorTheme),
      borderInactive: getTokenValue_COLOR(isUiLight ? 'border-subtle' : 'border-default', colorTheme),
      borderActive: getTokenValue_COLOR('text-inverse', colorTheme),
      borderQuery: getTokenValue_COLOR('border-highlight', colorTheme),
      borderHover: getTokenValue_COLOR('border-highlight', colorTheme),
      borderLegend: getTokenValue_COLOR('border-active', colorTheme),
    }),
    [colorTheme],
  )

  const sizes = useMemo(
    () => ({
      borderInactive: 0.5,
      borderActive: 1.3,
      borderQuery: 1.5,
      borderHover: 2,
      city: 5,
    }),
    [],
  )

  const shadows = useMemo(
    () => ({
      sm: {
        color: isUiLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.7)',
        blur: isUiLight ? 3 : 4,
        offsetX: 0,
        offsetY: isUiLight ? 1 : 2,
      },
      md: {
        color: isUiLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
        blur: 6,
        offsetX: 0,
        offsetY: 4,
      },
    }),
    [isUiLight],
  )

  const styles = useMemo(
    () => ({
      mapItem: {
        landscape: {
          areaColor: colors.land,
          borderColor: colors.borderInactive,
          borderWidth: sizes.borderInactive,
        },
        default: {
          opacity: 1,
          borderColor: colors.borderActive,
          borderWidth: sizes.borderActive,
        },
        unqueried: {
          opacity: 1,
          color: colors.valueNone,
          areaColor: colors.valueNone,
          borderColor: colors.borderActive,
          borderWidth: sizes.borderActive,
        },
        queried: {
          opacity: 1,
          borderColor: colors.borderQuery,
          borderWidth: sizes.borderQuery,
        },
        hover: {
          opacity: 1,
          areaColor: 'inherit',
          borderColor: colors.borderHover,
          borderWidth: sizes.borderHover,
          shadowColor: shadows.md.color,
          shadowBlur: shadows.md.blur,
          shadowOffsetX: shadows.md.offsetX,
          shadowOffsetY: shadows.md.offsetY,
        },
      } satisfies Record<string, EItemStyle>,
      legend: {
        itemWidth: 20,
        itemHeight: 120,
        textGap: 6,
        textStyle: {
          color: colors.text,
          fontFamily: getTokenValue_FONT_FAMILY('mono'),
          fontSize: '12px',
        },
      } satisfies ELegend,
      tooltip: {
        padding: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        extraCssText: 'box-shadow: none; color: unset;',
        className: tooltipClass,
      } satisfies ETooltip,
    }),
    [colors, sizes, shadows],
  )

  const cssContainer: CSSObject = {
    backgroundColor: colors.ocean,

    '& div': { cursor: 'unset !important' },

    '& svg g[clip-path] path': {
      stroke: colors.borderLegend,
      strokeWidth: '1px',
    },

    [`&.${draggingClass}`]: {
      cursor: 'grabbing',

      [`& .${tooltipClass}`]: {
        display: 'none !important',
      },
    },
  }

  const getCitySize = useCallback((zoom: number) => sizes.city * Math.sqrt(zoom), [sizes.city])

  const getItemStyle = useCallback(
    (status: 'default' | 'queried' | 'unqueried') => {
      return status === 'queried'
        ? styles.mapItem.queried
        : status === 'unqueried'
          ? styles.mapItem.unqueried
          : styles.mapItem.default
    },
    [styles],
  )

  return {
    colors,
    cssContainer,
    draggingClass,
    getCitySize,
    getItemStyle,
    shadows,
    sizes,
    styles,
  }
}
