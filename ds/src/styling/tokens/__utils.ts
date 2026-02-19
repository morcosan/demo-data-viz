import type { ColorTheme, DesignToken, DesignTokenGroup, DesignTokenThemeValue } from './__types.ts'

type Group<V> = DesignTokenGroup<V>

const getTokenValue = <K extends string, V>(tokenGroup: Group<V>, tokenName: K, theme?: ColorTheme): V => {
  const token = tokenGroup[tokenName] as DesignToken<V>
  if (!token) return undefined as V

  let value: V = undefined as V
  let ref: string

  if (token.$value !== undefined) {
    if (typeof token.$value === 'object') {
      value = (token.$value as DesignTokenThemeValue<V>)[theme as ColorTheme]
      if (!value) return undefined as V
    } else {
      value = token.$value
    }
  }

  if (token.$ref !== undefined) {
    if (typeof token.$ref === 'object') {
      ref = (token.$ref as DesignTokenThemeValue<string>)[theme as ColorTheme]
      if (!ref) return undefined as V
    } else {
      ref = token.$ref
    }

    value = getTokenValue<K, V>(tokenGroup, ref as K, theme)
  }

  return value
}

export { getTokenValue }
