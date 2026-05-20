import { readFileSync, rmSync } from 'fs'
import _ from 'lodash'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { FORMAT_NAME_CSS, FORMAT_NAME_TS } from './_format.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outDir = path.join(__dirname, '../../src/styles/tokens/_vars')
const tokensFile = path.join(__dirname, '../../src/styles/tokens/_data/tokens.json')
const tokensJson = JSON.parse(readFileSync(tokensFile, 'utf-8'))

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
