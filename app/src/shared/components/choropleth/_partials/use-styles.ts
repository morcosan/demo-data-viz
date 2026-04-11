import { getTokenValue_COLOR, getTokenValue_FONT_FAMILY, useThemeService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { type EItemStyle, type ELegend, type ETooltip } from './echarts-config'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()
  const draggingClass = 'choropleth-dragging'
  const tooltipClass = 'choropleth-tooltip'

  const colors = {
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
  }
  const sizes = {
    borderInactive: 0.5,
    borderActive: 1.3,
    borderQuery: 1.5,
    borderHover: 2,
    city: 10,
  }

  const shadows = {
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
  }

  const styles = {
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
      queryOther: {
        opacity: 1,
        areaColor: colors.valueNone,
        borderColor: colors.borderActive,
        borderWidth: sizes.borderActive,
      },
      queryActive: {
        opacity: 1,
        borderColor: colors.borderQuery,
        borderWidth: sizes.borderQuery,
        shadowColor: shadows.sm.color,
        shadowBlur: shadows.sm.blur,
        shadowOffsetX: shadows.sm.offsetX,
        shadowOffsetY: shadows.sm.offsetY,
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
  }

  const cssContainer: CSSObject = {
    backgroundColor: colors.ocean,

    '& div': { cursor: 'unset !important' },

    '& svg g[clip-path] path': {
      stroke: colors.borderLegend,
      strokeWidth: '1px',
    },

    [`&.${draggingClass} .${tooltipClass}`]: {
      display: 'none !important',
    },
  }

  return {
    colors,
    cssContainer,
    draggingClass,
    shadows,
    sizes,
    styles,
  }
}
