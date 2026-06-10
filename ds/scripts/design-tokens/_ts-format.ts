import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import StyleDictionary, { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { isColoredArray, isColoredValue, NOTICE, prettierConfig } from './_utils.ts'
import type {
  TokenAtomicValue,
  TokenColoredValue,
  TokenColorMode,
  TokenCompositeValue,
  TokenScalar,
  TokenScalarValue,
} from './schema.ts'

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

let _globalTokenMap: Record<string, TransformedToken>

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
  return isColoredValue(value) ? Object.values(value).some(isBrokenValue) : isBrokenValue(value as TokenScalarValue)
}

const unwrapValue = (value: TokenColoredValue | TokenScalarValue, mode: TokenColorMode): TokenScalarValue => {
  return isColoredValue(value) ? value[mode] : (value as TokenScalarValue)
}
const unwrapArray = (array: Array<TokenColoredValue | TokenScalarValue>, mode: TokenColorMode): TokenScalarValue => {
  return array.flatMap((value) => unwrapValue(value, mode))
}

const resolveScalar = (value: TokenScalar, mode: TokenColorMode, seen = new Set<string>()): TokenScalar => {
  if (typeof value !== 'string') return value
  return value.replace(/\{([^}]+)}/g, (_, path) => {
    if (seen.has(path)) return path
    const token = _globalTokenMap[path]
    const tokenValue = token?.$value
    const resolved = isColoredValue(tokenValue) ? tokenValue[mode] : tokenValue
    return resolveScalar(resolved, mode, new Set([...seen, path])) as string
  })
}
const resolveOriginal = (original: TokenAtomicValue, mode: TokenColorMode): TokenScalarValue => {
  if (typeof original === 'number') return original
  if (typeof original === 'string') return resolveScalar(original, mode)
  if (Array.isArray(original)) return original.map((value) => resolveScalar(value, mode))
  if (isColoredValue(original)) {
    const result = Object.fromEntries(
      Object.entries(original).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.map((value) => resolveScalar(value, mode)) : resolveScalar(value, mode),
      ]),
    )
    return result[mode]
  }
  return ''
}

const renderAtomicToken = (original: TokenAtomicValue, resolved: TokenAtomicValue): AtomicOutput => {
  const result: AtomicOutput = {} as AtomicOutput

  // Compute result.ref
  if (isColoredValue(original)) {
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
  result.value = isBrokenToken(resolved)
    ? { light: resolveOriginal(original, '$light'), dark: resolveOriginal(original, '$dark') }
    : isColoredValue(resolved)
      ? { light: unwrapValue(resolved.$light, '$light'), dark: unwrapValue(resolved.$dark, '$dark') }
      : isColoredArray(resolved)
        ? { light: unwrapArray(resolved, '$light'), dark: unwrapArray(resolved, '$dark') }
        : resolved

  return result
}

const renderCompositeToken = (original: TokenCompositeValue, resolved: TokenCompositeValue): CompositeOutput => {
  const result: CompositeOutput = { type: 'composite', ref: {}, value: {} }

  Object.keys(original).forEach((key) => {
    const camelKey = key.startsWith('--') ? key : camelCase(key)
    const output = renderAtomicToken(original[key], resolved[key])
    if (output.ref) result.ref[camelKey] = output.ref
    if (output.value) result.value[camelKey] = output.value
  })

  return result
}

const renderTokens = (tokens: TransformedToken[]) => {
  const result = {} as Record<string, AtomicOutput | CompositeOutput>

  for (const token of tokens) {
    const [leaf] = token.path.slice(1)
    result[leaf] =
      token.original?.$type === 'composite'
        ? renderCompositeToken(token.original?.$value, token.$value)
        : renderAtomicToken(token.original?.$value, token.$value)
  }

  return result
}

const createTsFormat = (sd: StyleDictionary): Format => {
  return {
    name: '',
    format: async ({ dictionary }: FormatFnArguments) => {
      if (!_globalTokenMap) {
        _globalTokenMap = Object.fromEntries(sd.allTokens.map((token) => [token.key?.replace(/[{}]/g, ''), token]))
      }
      const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
      const varName = namespace.toUpperCase().replaceAll('-', '_')
      const varCode = renderTokens(dictionary.allTokens)
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
