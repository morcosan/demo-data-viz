import { camelCase } from 'lodash-es'
import prettier from 'prettier'
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

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const getRefPath = (value: unknown): string | null => {
      return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') ? value.slice(1, -1) : null
    }

    const renderAtomicToken = (original: AtomicValue, resolved: AtomicValue): AtomicOutput => {
      const result: AtomicOutput = {} as AtomicOutput

      // Compute result.ref
      if (hasColorMode(original)) {
        const themed = original as unknown as ThemedValue
        const lightRef = getRefPath(themed.$light)
        const darkRef = getRefPath(themed.$dark)
        const ref = {} as ThemedOutput
        if (lightRef) ref.light = lightRef
        if (darkRef) ref.dark = darkRef
        if (lightRef || darkRef) result.ref = ref
      } else {
        const ref = getRefPath(original)
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

    const renderCompositeToken = (original: CompositeValue, resolved: CompositeValue): CompositeOutput => {
      const result: CompositeOutput = { type: 'composite', ref: {}, value: {} }

      Object.keys(original).forEach((key) => {
        const camelKey = camelCase(key)
        const originalValue = original[key]
        const resolvedValue = resolved[key]

        // Compute result.ref
        if (hasColorMode(originalValue)) {
          const themed = originalValue as ThemedValue
          const lightRef = getRefPath(themed.$light)
          const darkRef = getRefPath(themed.$dark)
          const ref = {} as ThemedOutput
          if (lightRef) ref.light = lightRef
          if (darkRef) ref.dark = darkRef
          if (lightRef || darkRef) result.ref[camelKey] = ref
        } else {
          const ref = getRefPath(originalValue)
          if (ref) result.ref[camelKey] = ref
        }

        // Compute result.value
        if (hasColorMode(resolvedValue)) {
          const themed = resolvedValue as ThemedValue
          result.value[camelKey] = {
            light: hasColorMode(themed.$light) ? (themed.$light as unknown as ThemedValue).$light : themed.$light,
            dark: hasColorMode(themed.$dark) ? (themed.$dark as unknown as ThemedValue).$dark : themed.$dark,
          }
        } else {
          result.value[camelKey] = resolvedValue as string | number
        }
      })

      return result
    }

    const renderTokens = (tokens: typeof dictionary.allTokens) => {
      const result: Record<string, unknown> = {}

      for (const token of tokens) {
        const keys = token.path.slice(1)
        let current = result

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] ??= {}
          current = current[keys[i]] as Record<string, unknown>
        }

        const leaf = keys[keys.length - 1]

        if (leaf === 'secondary-hover-default') {
          console.log('-------', leaf)
          console.log(token.original?.$value)
          console.log(token.$value)
        }

        current[leaf] =
          token.original?.$type === 'composite'
            ? renderCompositeToken(token.original?.$value, token.$value)
            : renderAtomicToken(token.original?.$value, token.$value)
      }

      return result
    }

    const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
    const varName = namespace.toUpperCase().replaceAll('-', '_')
    const varsCode = renderTokens(dictionary.allTokens)
    const json = JSON.stringify(varsCode, null, 2).replaceAll('\n', '')
    const output =
      NOTICE +
      `\nexport const CLASS_PREFIX__${varName} = '.ds-${namespace}-'\n` +
      `\nexport const CSS_PREFIX__${varName} = '--ds-${namespace}-'\n` +
      `\nexport const TOKENS__${varName} = ${json} as const\n`

    return await prettier.format(output, { ...prettierConfig, parser: 'typescript' })
  },
}

export { tsFormat }
