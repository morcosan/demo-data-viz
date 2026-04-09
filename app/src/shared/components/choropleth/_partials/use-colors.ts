import { getTokenValue_COLOR, useThemeService } from '@ds/core'

export const useColors = () => {
  const { colorTheme } = useThemeService()

  return {
    scaleLow: getTokenValue_COLOR('map-scale-low', colorTheme),
    scaleHigh: getTokenValue_COLOR('map-scale-high', colorTheme),
    land: getTokenValue_COLOR('map-land', colorTheme),
    ocean: getTokenValue_COLOR('map-ocean', colorTheme),
    border: getTokenValue_COLOR('border-default', colorTheme),
    borderHover: getTokenValue_COLOR('text-default', colorTheme),
  }
}
