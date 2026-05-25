import prettier from 'prettier'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig, type TokenColorMode } from './_utils.ts'
import { type ThemedValue } from './schema.ts'

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const parseRef = (value: unknown) => {
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

    const renderCompositeValue = (composite: Record<string, unknown>) => {
      const result: Record<string, unknown> = {}

      for (const [prop, value] of Object.entries(composite)) {
        if (hasColorMode(value)) {
          const themedValue = value as ThemedValue
          const lightRef = parseRef(themedValue.$light)
          const darkRef = parseRef(themedValue.$dark)
          if (lightRef && darkRef) {
            result[prop] = {
              ref: { light: lightRef, dark: darkRef },
              value: {
                light: resolveRef(lightRef, '$light') ?? themedValue.$light,
                dark: resolveRef(darkRef, '$dark') ?? themedValue.$dark,
              },
            }
          } else {
            result[prop] = {
              value: {
                light: lightRef ?? themedValue.$light,
                dark: darkRef ?? themedValue.$dark,
              },
            }
          }
        } else {
          const ref = parseRef(value)
          result[prop] = ref ? { ref, value: resolveRef(ref) ?? value } : { value }
        }
      }

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
        const value = token.original?.$value

        if (token.original?.$type === 'composite') {
          current[leaf] = { value: renderCompositeValue(value) }
        } else if (hasColorMode(value)) {
          const lightRef = parseRef(value.$light)
          const darkRef = parseRef(value.$dark)
          if (lightRef && darkRef) {
            current[leaf] = {
              ref: { light: lightRef, dark: darkRef },
              value: {
                light: resolveRef(lightRef, '$light') ?? value.$light,
                dark: resolveRef(darkRef, '$dark') ?? value.$dark,
              },
            }
          } else {
            current[leaf] = { value: { light: lightRef ?? value.$light, dark: darkRef ?? value.$dark } }
          }
        } else {
          const ref = parseRef(value)
          current[leaf] = ref ? { ref, value: token.$value } : { value: token.$value }
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
      `export const CSS_PREFIX__${varName} = '--ds-${namespace}-'\n\n` +
      `export const TOKENS__${varName} = ${json} as const\n`

    return await prettier.format(output, { ...prettierConfig, parser: 'typescript' })
  },
}

export { tsFormat }
