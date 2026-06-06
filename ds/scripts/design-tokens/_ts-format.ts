import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import StyleDictionary, { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig } from './_utils.ts'
import type {
  TokenAtomicValue,
  TokenColoredValue,
  TokenColorMode,
  TokenCompositeValue,
  TokenScalar,
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

const isRef = (value: unknown): value is string => typeof value === 'string' && /\{.*?}/s.test(value)
const parseRef = (value: unknown): string | string[] | null => {
  if (isRef(value)) return value
  if (Array.isArray(value) && value.some(isRef)) return value
  return null
}

const BROKEN_VALUE = '[object Object]'
const isBrokenValue = (value: TokenScalarValue) => {
  return typeof value === 'string' ? value.includes(BROKEN_VALUE) : Array.isArray(value) && value.some(isBrokenValue)
}
const isBrokenToken = (value: TokenAtomicValue): boolean => {
  return hasColorMode(value) ? Object.values(value).some(isBrokenValue) : isBrokenValue(value as TokenScalarValue)
}

const unwrapValue = (value: TokenColoredValue | TokenScalarValue, mode: TokenColorMode): TokenScalarValue => {
  return hasColorMode(value) ? value[mode] : (value as TokenScalarValue)
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

  const resolveOriginal = (original: AtomicValue, mode: TokenColorMode): TokenScalarValue => {
    const resolveScalar = (value: TokenScalar): TokenScalar => {
      return typeof value === 'string'
        ? value.replace(/\{([^}]+)}/g, (_, path) => {
            const token = tokenMap[path]
            const value = token?.$value
            return hasColorMode(value) ? value[mode] : value
          })
        : value
    }
    if (typeof original === 'number') return original
    if (typeof original === 'string') return resolveScalar(original)
    if (Array.isArray(original)) return original.map(resolveScalar)
    if (hasColorMode(original)) {
      const result = Object.fromEntries(
        Object.entries(original).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.map(resolveScalar) : resolveScalar(value as TokenScalar),
        ]),
      )
      return result[mode]
    }
    return ''
  }

  // Compute result.ref
  if (hasColorMode(original)) {
    const lightRef = parseRef(original.$light)
    const darkRef = parseRef(original.$dark)
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
    result.value = isBrokenToken(resolved)
      ? { light: resolveOriginal(original, '$light'), dark: resolveOriginal(original, '$dark') }
      : { light: unwrapValue(resolved.$light, '$light'), dark: unwrapValue(resolved.$dark, '$dark') }
  } else {
    result.value = resolved as string | number
  }

  return result
}

const renderTokens = (tokens: TransformedToken[], tokenMap: TokenMap) => {
  const result = {} as Record<string, AtomicOutput | CompositeOutput>

  for (const token of tokens) {
    const [leaf] = token.path.slice(1)

    if (token.path.includes('surface')) console.log('\n\n-------------------', leaf)

    result[leaf] =
      token.original?.$type === 'composite'
        ? renderCompositeToken(token.original?.$value, token.$value, tokenMap)
        : renderAtomicToken(token.original?.$value, token.$value, tokenMap)
  }

  return result
}

const createTsFormat = (sd: StyleDictionary): Format => {
  return {
    name: '',
    format: async ({ dictionary }: FormatFnArguments) => {
      const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
      const varName = namespace.toUpperCase().replaceAll('-', '_')
      const tokenMap = Object.fromEntries(sd.allTokens.map((token) => [token.key?.replace(/[{}]/g, ''), token]))
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
}

export { createTsFormat }
