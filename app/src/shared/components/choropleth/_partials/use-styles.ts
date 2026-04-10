import { getTokenValue_COLOR, getTokenValue_FONT_FAMILY, useThemeService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { type EItemStyle, type ELegend, type ETooltip } from './use-echarts'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()

  const colors = {
    text: getTokenValue_COLOR('text-default', colorTheme),
    minValue: getTokenValue_COLOR('map-scale-low', colorTheme),
    maxValue: getTokenValue_COLOR('map-scale-high', colorTheme),
    land: getTokenValue_COLOR('map-land', colorTheme),
    ocean: getTokenValue_COLOR('map-ocean', colorTheme),
    borderDefault: getTokenValue_COLOR('border-subtle', colorTheme),
    borderHover: getTokenValue_COLOR('text-default', colorTheme),
    borderQuery: getTokenValue_COLOR('bg-highlight', colorTheme),
  }
  const sizes = {
    borderDefault: 0.5,
    borderQuery: 1.5,
    borderHover: 1.2,
    city: 10,
  }

  const shadows = {
    sm: {
      color: isUiLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.7)',
      blur: 3,
      offsetX: 0,
      offsetY: 1,
    },
    md: {
      color: isUiLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.5)',
      blur: 6,
      offsetX: 0,
      offsetY: 4,
    },
    lg: {
      color: isUiLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.4)',
      blur: 15,
      offsetX: 0,
      offsetY: 10,
    },
  }

  const styles = {
    layer0: {
      landscape: {
        areaColor: colors.land,
        borderColor: colors.borderDefault,
        borderWidth: sizes.borderDefault,
      },
      default: {
        areaColor: colors.minValue,
        shadowColor: shadows.sm.color,
        shadowBlur: shadows.sm.blur,
        shadowOffsetX: shadows.sm.offsetX,
        shadowOffsetY: shadows.sm.offsetY,
      },
    } satisfies Record<string, EItemStyle>,
    layer1: {
      landscape: {
        opacity: 0,
      },
      default: {
        opacity: 1,
        borderColor: colors.borderDefault,
        borderWidth: sizes.borderDefault,
        shadowColor: shadows.sm.color,
        shadowBlur: shadows.sm.blur,
        shadowOffsetX: shadows.sm.offsetX,
        shadowOffsetY: shadows.sm.offsetY,
      },
      query: {
        opacity: 1,
        borderColor: colors.borderQuery,
        borderWidth: sizes.borderQuery,
        shadowColor: shadows.md.color,
        shadowBlur: shadows.md.blur,
        shadowOffsetX: shadows.md.offsetX,
        shadowOffsetY: shadows.md.offsetY,
      },
      hover: {
        opacity: 1,
        areaColor: 'inherit',
        borderColor: colors.borderHover,
        borderWidth: sizes.borderHover,
        shadowColor: shadows.lg.color,
        shadowBlur: shadows.lg.blur,
        shadowOffsetX: shadows.lg.offsetX,
        shadowOffsetY: shadows.lg.offsetY,
      },
    } satisfies Record<string, EItemStyle>,
    legend: {
      itemWidth: 20,
      itemHeight: 150,
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
    } satisfies ETooltip,
  }

  const cssCanvas: CSSObject = {
    backgroundColor: colors.ocean,

    '& *': {
      cursor: 'default !important',
    },

    '& svg g[clip-path] path': {
      stroke: getTokenValue_COLOR('border-active', colorTheme),
      strokeWidth: '1px',
    },
  }

  return {
    colors,
    cssCanvas,
    shadows,
    sizes,
    styles,
  }
}
