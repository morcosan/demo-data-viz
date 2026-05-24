import prettier from 'prettier'
import { type TransformedToken } from 'style-dictionary'
import { type Format, type FormatFnArguments } from 'style-dictionary/types'
import { formattedVariables } from 'style-dictionary/utils'
import { hasColorMode, NOTICE, prettierConfig, type TokenColorMode } from './_utils.ts'

const cssFormat: Format = {
  name: '',
  format: async ({ dictionary, options }: FormatFnArguments) => {
    const formatOptions = {
      usesDtcg: true,
      format: 'css',
      outputReferences: options.outputReferences,
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
    const getVars = (mode: TokenColorMode) => {
      const allTokens = mapTokens(dictionary.allTokens, mode)
      return formattedVariables({ dictionary: { ...dictionary, allTokens }, ...formatOptions })
    }
    const darkVars = getVars('$dark')
    const lightSelector = darkVars ? `,\n[data-color-mode='light']` : ''
    const lightOutput = `:root,\n:host${lightSelector} {\n${getVars('$light')}\n}\n`
    const darkOutput = darkVars ? `\n[data-color-mode='dark'] {\n${darkVars}\n}\n` : ''
    const output = NOTICE + lightOutput + darkOutput

    return await prettier.format(output, { ...prettierConfig, parser: 'css' })
  },
}

export { cssFormat }
