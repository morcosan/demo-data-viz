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

    const renderCssVars = (mode: TokenColorMode) => {
      const allTokens = mapTokens(atomicTokens, mode)
      return formattedVariables({ dictionary: { ...dictionary, allTokens }, ...formatOptions })
    }

    const resolveRef = (value: string): string => {
      return value.replace(/\{([^}]+)}/g, (_, path) => {
        const varName = path.replace(/\./g, '-')
        return `var(--ds-${varName})`
      })
    }

    const getClassName = (token: TransformedToken): string => 'ds-' + token.path.join('-')

    const renderClass = (token: TransformedToken, mode?: TokenColorMode) => {
      const className = getClassName(token)
      const rawValue = token.original.$value as CompositeValue
      const props = Object.entries(rawValue)
        .map(([prop, value]) => {
          const resolved = hasColorMode(value) ? (value as ThemedValue)[mode ?? '$light'] : value
          return `${prop}: ${resolveRef(String(resolved))};`
        })
        .join('\n')
      return `.${className} {\n${props}\n}`
    }

    const renderComposites = (): string => {
      const darkTokens = compositeTokens.filter((token) => Object.values(token.original.$value).some(hasColorMode))
      const lightCode = compositeTokens.map((token) => renderClass(token, '$light')).join('\n\n')
      const darkCode = darkTokens.map((token) => renderClass(token, '$dark')).join('\n\n')
      const darkOutput = darkTokens.length ? `\n[data-color-mode='dark'] {\n${darkCode}\n}\n` : ''
      return `\n${lightCode}\n` + darkOutput
    }

    const lightVarsCode = renderCssVars('$light')
    const darkVarsCode = renderCssVars('$dark')
    const lightSelector = darkVarsCode ? `,\n[data-color-mode='light']` : ''
    const lightVarsOutput = lightVarsCode ? `\n:root,\n:host${lightSelector} {\n${lightVarsCode}\n}\n` : ''
    const darkVarsOutput = darkVarsCode ? `\n[data-color-mode='dark'] {\n${darkVarsCode}\n}\n` : ''
    const compositeOutput = compositeTokens.length ? renderComposites() : ''
    const output = NOTICE + lightVarsOutput + darkVarsOutput + compositeOutput

    return await prettier.format(output, { ...prettierConfig, parser: 'css' })
  },
}

export { cssFormat }
