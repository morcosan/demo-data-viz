import { getTokenValue_COLOR, useThemeService } from '@ds/core'

export const useStyles = () => {
  const { colorTheme, isUiLight } = useThemeService()

  return {
    sizes: {
      border: 0.5,
      borderHover: 1.2,
    },
    colors: {
      scaleLow: getTokenValue_COLOR('map-scale-low', colorTheme),
      scaleHigh: getTokenValue_COLOR('map-scale-high', colorTheme),
      land: getTokenValue_COLOR('map-land', colorTheme),
      ocean: getTokenValue_COLOR('map-ocean', colorTheme),
      border: getTokenValue_COLOR('border-subtle', colorTheme),
      borderHover: getTokenValue_COLOR('text-default', colorTheme),
    },
    shadow: {
      color: isUiLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.4)',
      blur: 6,
      offsetX: 0,
      offsetY: 4,
    },
  }
}
