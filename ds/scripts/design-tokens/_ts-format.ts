import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig } from './_utils.ts'
import type {
  TokenAtomicValue,
  TokenColoredValue,
  TokenColorMode,
  TokenCompositeValue,
  TokenScalarValue,
} from './schema.ts'

type TokenMap = Record<string, TransformedToken>
type AtomicValue = TokenAtomicValue
type CompoValue = TokenCompositeValue
type AtomicOutput = {
  value: TokenScalarValue | ColoredOutput
  ref?: string | string[] | ColoredRefOutput
}
type CompositeOutput = {
  type: 'composite'
  ref: Record<string, string | string[] | ColoredRefOutput>
  value: Record<string, TokenScalarValue | ColoredOutput>
}
type ColoredOutput = {
  light: TokenScalarValue
  dark: TokenScalarValue
}
type ColoredRefOutput = {
  light: string | string[]
  dark: string | string[]
}

const renderCompositeToken = (original: CompoValue, resolved: CompoValue, tokenMap: TokenMap): CompositeOutput => {
  const result: CompositeOutput = { type: 'composite', ref: {}, value: {} }

  Object.keys(original).forEach((key) => {
    const camelKey = camelCase(key)
    const output = renderAtomicToken(original[key], resolved[key], tokenMap)
    if (output.ref) result.ref[camelKey] = output.ref
    if (output.value) result.value[camelKey] = output.value
  })

  return result
}

const renderAtomicToken = (original: AtomicValue, resolved: AtomicValue, tokenMap: TokenMap): AtomicOutput => {
  const result: AtomicOutput = {} as AtomicOutput

  const isRef = (value: unknown): value is string => typeof value === 'string' && /\{.*?}/s.test(value)
  const parseRef = (value: unknown): string | string[] | null => {
    if (isRef(value)) return value
    if (Array.isArray(value) && value.some(isRef)) return value
    return null
  }

  const isValueBroken = (value: AtomicValue) => typeof value === 'string' && value.includes('[object Object]')
  const resolveValue = (mode: TokenColorMode): string => {
    return typeof original === 'string'
      ? original.replace(/\{([^}]+)}/g, (_, path) => {
          const token = tokenMap[path]
          const value = token?.$value
          return hasColorMode(value) ? value[mode] : value
        })
      : ''
  }
  const unwrapValue = (value: TokenColoredValue | TokenScalarValue, mode: TokenColorMode): TokenScalarValue => {
    return hasColorMode(value) ? (value as TokenColoredValue)[mode] : (value as TokenScalarValue)
  }

  // Compute result.ref
  if (hasColorMode(original)) {
    const { $light, $dark } = original as TokenColoredValue
    const lightRef = parseRef($light)
    const darkRef = parseRef($dark)
    const ref = {} as ColoredRefOutput
    if (lightRef) ref.light = lightRef
    if (darkRef) ref.dark = darkRef
    if (lightRef || darkRef) result.ref = ref
  } else {
    const ref = parseRef(original)
    if (ref) result.ref = ref
  }

  // Compute result.value
  if (hasColorMode(resolved)) {
    const { $light, $dark } = resolved as TokenColoredValue
    console.log($light, $dark, isValueBroken(resolved))

    result.value = isValueBroken(resolved)
      ? { light: resolveValue('$light'), dark: resolveValue('$dark') }
      : { light: unwrapValue($light, '$light'), dark: unwrapValue($dark, '$dark') }
  } else {
    result.value = resolved as string | number
  }

  return result
}

const renderTokens = (tokens: TransformedToken[], tokenMap: TokenMap) => {
  const result = {} as Record<string, AtomicOutput | CompositeOutput>

  for (const token of tokens) {
    const [leaf] = token.path.slice(1)

    if (token.path.includes('surface')) console.log('\n-------', leaf)

    result[leaf] =
      token.original?.$type === 'composite'
        ? renderCompositeToken(token.original?.$value, token.$value, tokenMap)
        : renderAtomicToken(token.original?.$value, token.$value, tokenMap)
  }

  return result
}

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
    const varName = namespace.toUpperCase().replaceAll('-', '_')
    const tokenMap = Object.fromEntries(dictionary.allTokens.map((token) => [token.path.join('.'), token]))
    const varCode = renderTokens(dictionary.allTokens, tokenMap)
    const json = JSON.stringify(varCode, null, 2).replaceAll('\n', '')
    const output =
      NOTICE +
      `\nexport const CLASS_PREFIX__${varName} = 'ds-${namespace}-'\n` +
      `\nexport const CSS_PREFIX__${varName} = '--ds-${namespace}-'\n` +
      `\nexport const TOKENS__${varName} = ${json} as const\n`

    return await prettier.format(output, { ...prettierConfig, parser: 'typescript' })
  },
}

export { tsFormat }
