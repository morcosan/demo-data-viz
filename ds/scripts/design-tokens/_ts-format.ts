import prettier from 'prettier'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { hasColorMode, NOTICE, prettierConfig, stripNamespace } from './_utils.ts'

const tsFormat: Format = {
  name: '',
  format: async ({ dictionary }: FormatFnArguments) => {
    const toRef = (value: unknown) => {
      return typeof value === 'string' && value.startsWith('{') && value.endsWith('}') ? stripNamespace(value) : null
    }
    const buildObject = (tokens: typeof dictionary.allTokens) => {
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

        if (hasColorMode(value)) {
          const lightRef = toRef(value.$light)
          const darkRef = toRef(value.$dark)
          current[leaf] =
            lightRef && darkRef
              ? { ref: { light: lightRef, dark: darkRef } }
              : { value: { light: lightRef ?? value.$light, dark: darkRef ?? value.$dark } }
        } else {
          const ref = toRef(value)
          current[leaf] = ref ? { ref } : { value: token.$value }
        }
      }

      return result
    }
    const namespace = dictionary.allTokens[0]?.path[0] ?? 'unknown'
    const varName = namespace.toUpperCase().replaceAll('-', '_')
    const obj = buildObject(dictionary.allTokens)
    const json = JSON.stringify(obj, null, 2).replaceAll('\n', '')
    const output =
      NOTICE +
      `export const CSS_PREFIX__${varName} = '--ds-${namespace}-'\n\n` +
      `export const TOKENS__${varName} = ${json} as const\n`

    return await prettier.format(output, { ...prettierConfig, parser: 'typescript' })
  },
}

export { tsFormat }
