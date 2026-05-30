import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig } from './_utils.ts'
import { type AtomicValue, type CompositeValue, type ThemedValue } from './schema.ts'

type AtomicOutput = {
  value: string | number | ThemedOutput
  ref?: string | ThemedOutput
}
type CompositeOutput = {
  type: 'composite'
  ref: Record<string, string | ThemedOutput>
  value: Record<string, string | number | ThemedOutput>
}
type ThemedOutput = {
  light: string | number
  dark: string | number
}

const parseRef = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  return /\{.*?}/s.test(value) ? value : null
}

const renderCompositeToken = (original: CompositeValue, resolved: CompositeValue): CompositeOutput => {
  const result: CompositeOutput = { type: 'composite', ref: {}, value: {} }

  Object.keys(original).forEach((key) => {
    const camelKey = camelCase(key)
    const output = renderAtomicToken(original[key], resolved[key])
    if (output.ref) result.ref[camelKey] = output.ref
    if (output.value) result.value[camelKey] = output.value
  })

  return result
}

const renderAtomicToken = (original: AtomicValue, resolved: AtomicValue): AtomicOutput => {
  const result: AtomicOutput = {} as AtomicOutput

  // Compute result.ref
  if (hasColorMode(original)) {
    const themed = original as unknown as ThemedValue
    const lightRef = parseRef(themed.$light)
    const darkRef = parseRef(themed.$dark)
    const ref = {} as ThemedOutput
    if (lightRef) ref.light = lightRef
    if (darkRef) ref.dark = darkRef
    if (lightRef || darkRef) result.ref = ref
  } else {
    const ref = parseRef(original)
    if (ref) result.ref = ref
  }

  // Compute result.value
  if (hasColorMode(resolved)) {
    const themed = resolved as unknown as ThemedValue
    result.value = {
      light: hasColorMode(themed.$light) ? (themed.$light as unknown as ThemedValue).$light : themed.$light,
      dark: hasColorMode(themed.$dark) ? (themed.$dark as unknown as ThemedValue).$dark : themed.$dark,
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
