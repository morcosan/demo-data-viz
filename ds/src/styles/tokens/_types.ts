export type TokenGroup = Record<string, Token>
export type Token =
  | {
      value: TokenAtomicValue
      ref?: TokenAtomicValue<string>
      type?: undefined
    }
  | {
      type: 'composite'
      value: TokenCompositeValue
      ref?: TokenCompositeValue<string>
    }

export type TokenScalar = string | number
export type TokenScalarValue<T = TokenScalar> = T | T[]
export type TokenColoredValue<T = TokenScalar> = Record<ColorMode, TokenScalarValue<T>>
export type TokenAtomicValue<T = TokenScalar> = TokenScalarValue<T> | TokenColoredValue<T>
export type TokenCompositeValue<T = TokenScalar> = Record<string, TokenAtomicValue<T>>

export type ColorMode = 'light' | 'dark'
export type ColorTheme = 'simple' | 'modern'
