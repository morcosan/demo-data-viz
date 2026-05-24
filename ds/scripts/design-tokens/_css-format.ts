import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { formattedVariables } from 'style-dictionary/utils'
import { hasColorMode, NOTICE, prettierConfig, type TokenColorMode } from './_utils.ts'
import { type CompositeValue, type ThemedValue } from './schema.ts'

const cssFormat: Format = {
  name: '',
  format: async ({ dictionary, options }: FormatFnArguments) => {
    const formatOptions = {
      usesDtcg: true,
      format: 'css',
      outputReferences: options.outputReferences,
    }

    // Separate composite tokens from regular tokens
    const compositeTokens = dictionary.allTokens.filter((token) => token.$type === 'composite')
    const atomicTokens = dictionary.allTokens.filter((token) => token.$type !== 'composite')

    const mapTokens = (tokens: TransformedToken[], mode: TokenColorMode) => {
      return tokens
        .filter((token) => mode === '$light' || hasColorMode(token.$value))
        .map((token) => {
          const modeValue = hasColorMode(token.$value) ? token.$value[mode] : token.$value
          return {
            ...token,
            $value: modeValue,
            original: {
              ...token.original,
              $value: hasColorMode(token.original.$value) ? token.original.$value[mode] : token.original.$value,
            },
          }
        })
    }

    const getVars = (mode: TokenColorMode) => {
      const allTokens = mapTokens(atomicTokens, mode)
      return formattedVariables({ dictionary: { ...dictionary, allTokens }, ...formatOptions })
    }

    const resolveRef = (value: string): string => {
      return value.replace(/\{([^}]+)}/g, (_, path) => {
        const varName = path.replace(/\./g, '-')
        return `var(--ds-${varName})`
      })
    }

    const tokenToClassName = (token: TransformedToken): string => {
      return 'ds-' + token.path.join('-')
    }

    const generateCompositeClasses = (): string => {
      if (compositeTokens.length === 0) return ''

      const renderClass = (token: TransformedToken, mode?: TokenColorMode) => {
        const className = tokenToClassName(token)
        const rawValue = token.original.$value as CompositeValue

        const props = Object.entries(rawValue)
          .map(([prop, value]) => {
            const resolved = hasColorMode(value) ? (value as ThemedValue)[mode ?? '$light'] : value
            return `  ${prop}: ${resolveRef(String(resolved))};`
          })
          .join('\n')

        return `.${className} {\n${props}\n}`
      }

      const lightClasses = compositeTokens.map((t) => renderClass(t, '$light')).join('\n\n')

      const darkTokens = compositeTokens.filter((token) =>
        Object.values(token.original.$value as Record<string, unknown>).some(hasColorMode),
      )

      if (darkTokens.length === 0) {
        return '\n' + lightClasses + '\n'
      }

      const darkClasses = darkTokens.map((t) => renderClass(t, '$dark')).join('\n\n')

      return '\n' + lightClasses + `\n\n[data-color-mode='dark'] {\n` + darkClasses + '\n}\n'
    }

    const lightVarsCode = getVars('$light')
    const darkVarsCode = getVars('$dark')
    const lightSelector = darkVarsCode ? `,\n[data-color-mode='light']` : ''
    const lightOutput = lightVarsCode ? `\n:root,\n:host${lightSelector} {\n${lightVarsCode}\n}\n` : ''
    const darkOutput = darkVarsCode ? `\n[data-color-mode='dark'] {\n${darkVarsCode}\n}\n` : ''
    const compositeOutput = generateCompositeClasses()
    const output = NOTICE + lightOutput + darkOutput + compositeOutput

    return await prettier.format(output, { ...prettierConfig, parser: 'css' })
  },
}

export { cssFormat }
