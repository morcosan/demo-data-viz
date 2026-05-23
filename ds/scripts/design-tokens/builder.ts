import { readFileSync, rmSync } from 'fs'
import _ from 'lodash'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { FORMAT_NAME_CSS, FORMAT_NAME_TS } from './_format.ts'
import { type TokenType } from './schema.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outDir = path.join(__dirname, '../../src/styles/tokens/_vars')
const tokensFile = path.join(__dirname, '../../src/styles/tokens/_data/tokens.json')
const rawTokensJson = JSON.parse(readFileSync(tokensFile, 'utf-8'))
const isComposite = (token: TokenType) => '$type' in token && token.$type === 'composite'
const tokensJson = Object.fromEntries(
  Object.entries<Record<string, TokenType>>(rawTokensJson)
    .map(([group, groupTokens]) => [
      group,
      Object.fromEntries(Object.entries<TokenType>(groupTokens).filter(([, token]) => !isComposite(token))),
    ])
    .filter(([, groupTokens]) => Object.keys(groupTokens).length > 0),
)

// Clear folder
rmSync(outDir, { recursive: true, force: true })

const builder = new StyleDictionary({
  tokens: tokensJson,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: outDir,
      options: { outputReferences: true },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${_.kebabCase(name)}.css`,
        format: FORMAT_NAME_CSS,
        filter: (token) => token.path[0] === name,
      })),
    },
    ts: {
      transformGroup: 'css',
      buildPath: outDir,
      options: { outputReferences: false },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${_.kebabCase(name)}.ts`,
        format: FORMAT_NAME_TS,
        filter: (token) => token.path[0] === name,
      })),
    },
  },
})

await builder.buildAllPlatforms()
