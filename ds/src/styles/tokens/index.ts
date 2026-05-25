import { CSS_PREFIX__BLUR, TOKENS__BLUR } from './_dist/blur'
import { CSS_PREFIX__BREAKPOINT, TOKENS__BREAKPOINT } from './_dist/breakpoint'
import { CSS_PREFIX__COLOR, TOKENS__COLOR } from './_dist/color'
import { CSS_PREFIX__FONT_FAMILY, TOKENS__FONT_FAMILY } from './_dist/font-family'
import { CSS_PREFIX__FONT_SIZE, TOKENS__FONT_SIZE } from './_dist/font-size'
import { CSS_PREFIX__FONT_WEIGHT, TOKENS__FONT_WEIGHT } from './_dist/font-weight'
import { CSS_PREFIX__LINE_HEIGHT, TOKENS__LINE_HEIGHT } from './_dist/line-height'
import { CSS_PREFIX__RADIUS, TOKENS__RADIUS } from './_dist/radius'
import { CSS_PREFIX__SHADOW, TOKENS__SHADOW } from './_dist/shadow'
import { CSS_PREFIX__SPACING, TOKENS__SPACING } from './_dist/spacing'
import { CSS_PREFIX__SURFACE, TOKENS__SURFACE } from './_dist/surface'
import { CSS_PREFIX__Z_INDEX, TOKENS__Z_INDEX } from './_dist/z-index'
import {
  type ColorMode,
  type DesignToken,
  type DesignTokenComposite,
  type DesignTokenGroup,
  type DesignTokenModeValue,
  type DesignTokenValue,
} from './_types'

const TOKENS = {
  BLUR: TOKENS__BLUR,
  BREAKPOINT: TOKENS__BREAKPOINT,
  COLOR: TOKENS__COLOR,
  FONT_FAMILY: TOKENS__FONT_FAMILY,
  FONT_SIZE: TOKENS__FONT_SIZE,
  FONT_WEIGHT: TOKENS__FONT_WEIGHT,
  LINE_HEIGHT: TOKENS__LINE_HEIGHT,
  RADIUS: TOKENS__RADIUS,
  SHADOW: TOKENS__SHADOW,
  SPACING: TOKENS__SPACING,
  SURFACE: TOKENS__SURFACE,
  Z_INDEX: TOKENS__Z_INDEX,
} satisfies Record<string, DesignTokenGroup>

const CSS_PREFIX = {
  BLUR: CSS_PREFIX__BLUR,
  BREAKPOINT: CSS_PREFIX__BREAKPOINT,
  COLOR: CSS_PREFIX__COLOR,
  FONT_FAMILY: CSS_PREFIX__FONT_FAMILY,
  FONT_SIZE: CSS_PREFIX__FONT_SIZE,
  FONT_WEIGHT: CSS_PREFIX__FONT_WEIGHT,
  LINE_HEIGHT: CSS_PREFIX__LINE_HEIGHT,
  RADIUS: CSS_PREFIX__RADIUS,
  SHADOW: CSS_PREFIX__SHADOW,
  SPACING: CSS_PREFIX__SPACING,
  SURFACE: CSS_PREFIX__SURFACE,
  Z_INDEX: CSS_PREFIX__Z_INDEX,
} satisfies Record<string, string>

type Token = DesignToken<DesignTokenValue>

const getTokenValue = <V = string | number | DesignTokenComposite>(token: Token, mode?: ColorMode): V => {
  if (token.type === 'composite') {
    const result: Record<string, string | number> = {}
    for (const key in token.value) {
      result[key] =
        typeof token.value[key] === 'object'
          ? (token.value[key] as DesignTokenModeValue)[mode || 'light']
          : token.value[key]
    }
    return result as V
  }

  return typeof token.value === 'object'
    ? (token.value as DesignTokenModeValue<V>)[mode || 'light']
    : (token.value as V)
}

export * from './_types'
export { CSS_PREFIX, getTokenValue, TOKENS }
