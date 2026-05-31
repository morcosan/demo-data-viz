import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig } from './_utils.ts'
import type { TokenAtomicValue, TokenColoredValue, TokenCompositeValue, TokenScalarValue } from './schema.ts'

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

const parseRef = (value: unknown): string | string[] | null => {
  if (typeof value === 'string' && /\{.*?}/s.test(value)) return value
  if (Array.isArray(value)) {
    if (value.some((entry: unknown) => typeof entry === 'string' && /\{.*?}/s.test(entry))) return value
  }
  return null
}

const renderCompositeToken = (original: TokenCompositeValue, resolved: TokenCompositeValue): CompositeOutput => {
  const result: CompositeOutput = { type: 'composite', ref: {}, value: {} }

  Object.keys(original).forEach((key) => {
    const camelKey = camelCase(key)
    const output = renderAtomicToken(original[key], resolved[key])
    if (output.ref) result.ref[camelKey] = output.ref
    if (output.value) result.value[camelKey] = output.value
  })

  return result
}

const renderAtomicToken = (original: TokenAtomicValue, resolved: TokenAtomicValue): AtomicOutput => {
  const result: AtomicOutput = {} as AtomicOutput

  // Compute result.ref
  if (hasColorMode(original)) {
    const themed = original as unknown as TokenColoredValue
    const lightRef = parseRef(themed.$light)
    const darkRef = parseRef(themed.$dark)
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
    const themed = resolved as unknown as TokenColoredValue
    result.value = {
      light: hasColorMode(themed.$light) ? (themed.$light as unknown as TokenColoredValue).$light : themed.$light,
      dark: hasColorMode(themed.$dark) ? (themed.$dark as unknown as TokenColoredValue).$dark : themed.$dark,
    }
  } else {
    result.value = resolved as string | number
  }

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

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
    const varName = namespace.toUpperCase().replaceAll('-', '_')
    const varCode = renderTokens(dictionary.allTokens)
    const json = JSON.stringify(varCode, null, 2).replaceAll('\n', '')
    const output =
      NOTICE +
      `\nexport const CLASS_PREFIX__${varName} = '.ds-${namespace}-'\n` +
      `\nexport const CSS_PREFIX__${varName} = '--ds-${namespace}-'\n` +
      `\nexport const TOKENS__${varName} = ${json} as const\n`

    return await prettier.format(output, { ...prettierConfig, parser: 'typescript' })
  },
}

export { tsFormat }
