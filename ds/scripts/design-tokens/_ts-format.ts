import { camelCase } from 'lodash-es'
import prettier from 'prettier'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig, type TokenColorMode } from './_utils.ts'
import { type CompositeValue, type ThemedValue } from './schema.ts'

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const getRefPath = (value: unknown) => {
      return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') ? value.slice(1, -1) : null
    }

    const resolveRef = (refPath: string, mode?: TokenColorMode): unknown => {
      const token = dictionary.allTokens.find((t) => t.path.join('.') === refPath)
      if (!token) return null
      const value = token.$value
      if (hasColorMode(value)) {
        const themed = value as ThemedValue
        return mode ? themed[mode] : { light: themed.$light, dark: themed.$dark }
      }
      return value
    }

    const renderComposite = (original: CompositeValue, resolved: CompositeValue) => {
      const result = {
        type: 'composite',
        ref: {} as Record<string, unknown>,
        value: {} as Record<string, unknown>,
      }

      Object.keys(original).forEach((key) => {
        const camelKey = camelCase(key)
        const originalValue = original[key]
        const resolvedValue = resolved[key]

        // Compute result.ref
        if (hasColorMode(originalValue)) {
          const themed = originalValue as ThemedValue
          const lightRef = getRefPath(themed.$light)
          const darkRef = getRefPath(themed.$dark)
          result.ref[camelKey] = { light: lightRef, dark: darkRef }
        } else {
          result.ref[camelKey] = getRefPath(originalValue)
        }

        // Compute result.value
        if (hasColorMode(resolvedValue)) {
          const themed = resolvedValue as ThemedValue
          result.value[camelKey] = {
            light: hasColorMode(themed.$light) ? (themed.$light as unknown as ThemedValue).$light : themed.$light,
            dark: hasColorMode(themed.$dark) ? (themed.$light as unknown as ThemedValue).$dark : themed.$dark,
          }
        } else {
          result.value[camelKey] = resolvedValue
        }
      })

      return result
    }

    const renderTsVars = (tokens: typeof dictionary.allTokens) => {
      const result: Record<string, unknown> = {}

      for (const token of tokens) {
        const keys = token.path.slice(1)
        let current = result

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] ??= {}
          current = current[keys[i]] as Record<string, unknown>
        }

        const leaf = keys[keys.length - 1]
        const originalValue = token.original?.$value
        const resolvedValue = token.$value

        console.log('-----', leaf)

        if (token.original?.$type === 'composite') {
          current[leaf] = renderComposite(originalValue, resolvedValue)
        } else {
          if (hasColorMode(originalValue)) {
            const themed = originalValue as ThemedValue
            const lightRef = getRefPath(themed.$light)
            const darkRef = getRefPath(themed.$dark)

            if (lightRef && darkRef) {
              current[leaf] = {
                ref: { light: lightRef, dark: darkRef },
                value: {
                  light: resolveRef(lightRef, '$light') ?? themed.$light,
                  dark: resolveRef(darkRef, '$dark') ?? themed.$dark,
                },
              }
            } else {
              current[leaf] = { value: { light: themed.$light, dark: themed.$dark } }
            }
          } else {
            const ref = getRefPath(originalValue)
            current[leaf] = ref ? { ref, value: token.$value } : { value: token.$value }
          }
        }
      }

      return result
    }

    const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
    const varName = namespace.toUpperCase().replaceAll('-', '_')
    const varsCode = renderTsVars(dictionary.allTokens)
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
