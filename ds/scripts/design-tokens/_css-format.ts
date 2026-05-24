import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { formattedVariables } from 'style-dictionary/utils'
import { hasColorMode, NOTICE, prettierConfig, type TokenColorMode } from './_utils.ts'
import { type CompositeValue, type ThemedValue } from './schema.ts'

const CSS_PREFIX = '--ds-'
const CLASS_PREFIX = 'ds-'
const LIGHT_SELECTOR = "[data-color-mode='light']"
const DARK_SELECTOR = "[data-color-mode='dark']"

const resolveRef = (value: string): string => {
  return value.replace(/\{([^}]+)}/g, (_, path) => {
    const varName = path.replace(/\./g, '-')
    return `var(${CSS_PREFIX}${varName})`
  })
}

const getClassName = (token: TransformedToken): string => CLASS_PREFIX + token.path.join('-')

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

const cssFormat: Format = {
  name: '',
  format: async ({ dictionary, options }: FormatFnArguments) => {
    const formatOptions = {
      usesDtcg: true,
      format: 'css',
      formatting: { prefix: CSS_PREFIX },
      outputReferences: options.outputReferences,
    }
    const compositeTokens = dictionary.allTokens.filter((token) => token.$type === 'composite')
    const atomicTokens = dictionary.allTokens.filter((token) => token.$type !== 'composite')
    const renderComposites = (): string => {
      const darkTokens = compositeTokens.filter((token) => Object.values(token.original.$value).some(hasColorMode))
      const lightCode = compositeTokens.map((token) => renderClass(token, '$light')).join('\n\n')
      const darkCode = darkTokens.map((token) => renderClass(token, '$dark')).join('\n\n')
      const darkOutput = darkTokens.length ? `\n${DARK_SELECTOR}{${darkCode}}\n` : ''
      return `\n:where(html),${LIGHT_SELECTOR}{${lightCode}}\n${darkOutput}`
    }
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

    const lightVarsCode = renderCssVars('$light')
    const darkVarsCode = renderCssVars('$dark')
    const lightSelector = darkVarsCode ? `,${LIGHT_SELECTOR}` : ''
    const lightVarsOutput = lightVarsCode ? `\n:root,:host${lightSelector}{${lightVarsCode}}\n` : ''
    const darkVarsOutput = darkVarsCode ? `\n${DARK_SELECTOR}{${darkVarsCode}}\n` : ''
    const compositeOutput = compositeTokens.length ? renderComposites() : ''
    const output = NOTICE + lightVarsOutput + darkVarsOutput + compositeOutput

    return await prettier.format(output, { ...prettierConfig, parser: 'css' })
  },
}

export { cssFormat }
