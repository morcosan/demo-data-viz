import { getTokenValue_COLOR, useThemeService } from '@ds/core'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()

  return {
    sizes: {
      border: 0.5,
      borderHover: 1.2,
      borderQuery: 2,
    },
    colors: {
      scaleLow: getTokenValue_COLOR('map-scale-low', colorTheme),
      scaleHigh: getTokenValue_COLOR('map-scale-high', colorTheme),
      land: getTokenValue_COLOR('map-land', colorTheme),
      ocean: getTokenValue_COLOR('map-ocean', colorTheme),
      border: getTokenValue_COLOR('border-subtle', colorTheme),
      borderHover: getTokenValue_COLOR('text-default', colorTheme),
      borderQuery: getTokenValue_COLOR('bg-highlight', colorTheme),
    },
    shadows: {
      sm: {
        color: isUiLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.4)',
        blur: 3,
        offsetX: 0,
        offsetY: 1,
      },
      md: {
        color: isUiLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.4)',
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
    },
  }
}
