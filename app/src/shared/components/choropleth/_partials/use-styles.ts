import { getTokenValue, oklchToHex, TOKENS, useThemeService, useViewportService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { useCallback, useMemo } from 'react'
import { type EItemStyle, type ELegend, type ETooltip } from '../_types'

export const useStyles = () => {
  const { colorMode, isUiLight } = useThemeService()
  const { isViewportMaxLG: isMobile } = useViewportService()
  const draggingClass = 'choropleth-dragging'
  const tooltipClass = 'choropleth-tooltip'

  const colors = useMemo(
    () => ({
      text: oklchToHex(getTokenValue(TOKENS.COLOR['text-default'], colorMode)),
      valueNone: oklchToHex(getTokenValue(TOKENS.COLOR['map-value-none'], colorMode)),
      valueMin: oklchToHex(getTokenValue(TOKENS.COLOR['map-value-min'], colorMode)),
      valueMax: oklchToHex(getTokenValue(TOKENS.COLOR['map-value-max'], colorMode)),
      land: oklchToHex(getTokenValue(TOKENS.COLOR['map-land'], colorMode)),
      ocean: oklchToHex(getTokenValue(TOKENS.COLOR['map-ocean'], colorMode)),
      borderInactive: oklchToHex(
        getTokenValue(TOKENS.COLOR[isUiLight ? 'border-subtle' : 'border-default'], colorMode),
      ),
      borderActive: oklchToHex(getTokenValue(TOKENS.COLOR['text-inverse'], colorMode)),
      borderQuery: oklchToHex(getTokenValue(TOKENS.COLOR['border-highlight'], colorMode)),
      borderHover: oklchToHex(getTokenValue(TOKENS.COLOR['border-highlight'], colorMode)),
      borderLegend: oklchToHex(getTokenValue(TOKENS.COLOR['border-active'], colorMode)),
    }),
    [colorMode, isUiLight],
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
          shadowColor: isMobile ? undefined : shadows.md.color,
          shadowBlur: isMobile ? undefined : shadows.md.blur,
          shadowOffsetX: isMobile ? undefined : shadows.md.offsetX,
          shadowOffsetY: isMobile ? undefined : shadows.md.offsetY,
        },
      } satisfies Record<string, EItemStyle>,
      legend: {
        itemWidth: 20,
        itemHeight: 120,
        textGap: 6,
        textStyle: {
          color: colors.text,
          fontFamily: getTokenValue(TOKENS.FONT_FAMILY['mono']),
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
    [colors, sizes, shadows, isMobile],
  )

  const containerCss: CSSObject = {
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
    containerCss,
    draggingClass,
    getCitySize,
    getItemStyle,
    shadows,
    sizes,
    styles,
  }
}
