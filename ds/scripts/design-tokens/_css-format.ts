import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { formattedVariables } from 'style-dictionary/utils'
import { hasColorMode, NOTICE, prettierConfig } from './_utils.ts'
import { type TokenColorMode, type TokenCompositeValue } from './schema.ts'

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

const renderClassProps = (token: TransformedToken, mode?: TokenColorMode) => {
  const rawValue = token.original.$value as TokenCompositeValue
  return Object.entries(rawValue)
    .map(([prop, value]) => {
      const resolved = hasColorMode(value) ? value[mode ?? '$light'] : value
      return `${prop}: ${resolveRef(String(resolved))};`
    })
    .join('\n')
}

const createCssFormat = (): Format => {
  return {
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
        const utilities = compositeTokens.map((token) => {
          const className = getClassName(token)
          const lightCode = `:where(html) &,${LIGHT_SELECTOR} &{${renderClassProps(token, '$light')}}`
          const darkCode = darkTokens.includes(token) ? `${DARK_SELECTOR} &{${renderClassProps(token, '$dark')}}` : ''
          return `@utility ${className} {${lightCode}\n\n${darkCode}}`
        })
        return `\n${utilities.join('\n\n')}`
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
}

export { createCssFormat }
