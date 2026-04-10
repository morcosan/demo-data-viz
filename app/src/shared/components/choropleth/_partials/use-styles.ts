import { getTokenValue_COLOR, getTokenValue_FONT_FAMILY, useThemeService } from '@ds/core'
import { type CSSObject } from '@emotion/react'
import { type EItemStyle, type ELegend, type ETooltip } from './echarts-config'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()

  const colors = {
    text: getTokenValue_COLOR('text-default', colorTheme),
    valueMin: getTokenValue_COLOR('map-scale-min', colorTheme),
    valueMax: getTokenValue_COLOR('map-scale-max', colorTheme),
    valueNone: getTokenValue_COLOR('map-scale-none', colorTheme),
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
      color: isUiLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.7)',
      blur: isUiLight ? 3 : 4,
      offsetX: 0,
      offsetY: isUiLight ? 1 : 2,
    },
    md: {
      color: isUiLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)',
      blur: 8,
      offsetX: 0,
      offsetY: 5,
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
        areaColor: colors.valueNone,
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
    } satisfies ETooltip,
  }

  const cssContainer: CSSObject = {
    backgroundColor: colors.ocean,

    '& *': {
      cursor: 'unset !important',
    },

    '& svg g[clip-path] path': {
      stroke: getTokenValue_COLOR('border-active', colorTheme),
      strokeWidth: '1px',
    },
  }

  return {
    colors,
    cssContainer,
    shadows,
    sizes,
    styles,
  }
}
