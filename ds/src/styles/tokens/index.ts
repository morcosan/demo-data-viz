import { type ColorMode, type DesignToken, type DesignTokenGroup, type DesignTokenModeValue } from './_types'
import { CSS_PREFIX__BLUR, TOKENS__BLUR } from './_vars/blur'
import { CSS_PREFIX__BREAKPOINT, TOKENS__BREAKPOINT } from './_vars/breakpoint'
import { CSS_PREFIX__COLOR, TOKENS__COLOR } from './_vars/color'
import { CSS_PREFIX__FONT_FAMILY, TOKENS__FONT_FAMILY } from './_vars/font-family'
import { CSS_PREFIX__FONT_SIZE, TOKENS__FONT_SIZE } from './_vars/font-size'
import { CSS_PREFIX__FONT_WEIGHT, TOKENS__FONT_WEIGHT } from './_vars/font-weight'
import { CSS_PREFIX__LINE_HEIGHT, TOKENS__LINE_HEIGHT } from './_vars/line-height'
import { CSS_PREFIX__RADIUS, TOKENS__RADIUS } from './_vars/radius'
import { CSS_PREFIX__SHADOW, TOKENS__SHADOW } from './_vars/shadow'
import { CSS_PREFIX__SPACING, TOKENS__SPACING } from './_vars/spacing'
import { CSS_PREFIX__Z_INDEX, TOKENS__Z_INDEX } from './_vars/z-index'

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
  Z_INDEX: TOKENS__Z_INDEX,
}

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
  Z_INDEX: CSS_PREFIX__Z_INDEX,
}

type Group = DesignTokenGroup<any>
type Value<G> = G extends DesignTokenGroup<infer V> ? V : never

const getTokenValue = <G extends Group = Group>(tokenGroup: G, tokenName: keyof G, mode?: ColorMode): Value<G> => {
  const token = tokenGroup[tokenName] as DesignToken<Value<G>>
  if (!token) return undefined as Value<G>

  let value = undefined as Value<G>
  let ref: string

  if (token.value !== undefined) {
    if (typeof token.value === 'object') {
      value = (token.value as DesignTokenModeValue<Value<G>>)[mode as ColorMode]
      if (value === undefined) return undefined as Value<G>
    } else {
      value = token.value
    }
  }

  if (token.ref !== undefined) {
    if (typeof token.ref === 'object') {
      ref = (token.ref as DesignTokenModeValue<string>)[mode as ColorMode]
      if (ref === undefined) return undefined as Value<G>
    } else {
      ref = token.ref
    }

    value = getTokenValue(tokenGroup, ref, mode)
  }

  return value
}

export * from './_types'
export { CSS_PREFIX, getTokenValue, TOKENS }
