export type DesignToken<V = DesignTokenValue> = {
  readonly value: V
  readonly ref?: string | DesignTokenModeValue<string>
}

export type DesignTokenGroup<V = DesignTokenValue> = {
  readonly [key: string]: DesignToken<V>
}

export type DesignTokenModeValue<V = string | number> = Record<ColorMode, V>
export type DesignTokenValue<V = string | number> = V | DesignTokenModeValue<V>

export type ColorMode = 'light' | 'dark'
export type ColorTheme = 'simple' | 'modern'
