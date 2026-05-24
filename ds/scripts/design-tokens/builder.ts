import { readFileSync, rmSync } from 'fs'
import _ from 'lodash'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { cssFormat } from './_css-format.ts'
import { tsFormat } from './_ts-format.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FORMAT_NAME__CSS = 'css/ds-format'
const FORMAT_NAME__TS = 'ts/ds-format'
const outDir = path.join(__dirname, '../../src/styles/tokens/_dist')
const tokensFile = path.join(__dirname, '../../src/styles/tokens/_src/tokens.json')
const tokensJson = JSON.parse(readFileSync(tokensFile, 'utf-8'))

// Clear folder
rmSync(outDir, { recursive: true, force: true })

StyleDictionary.registerFormat({ ...cssFormat, name: FORMAT_NAME__CSS })
StyleDictionary.registerFormat({ ...tsFormat, name: FORMAT_NAME__TS })

const builder = new StyleDictionary({
  tokens: tokensJson,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: outDir,
      options: { outputReferences: true },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${_.kebabCase(name)}.css`,
        format: FORMAT_NAME__CSS,
        filter: (token) => token.path[0] === name,
      })),
    },
    ts: {
      transformGroup: 'css',
      buildPath: outDir,
      options: { outputReferences: false },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${_.kebabCase(name)}.ts`,
        format: FORMAT_NAME__TS,
        filter: (token) => token.path[0] === name,
      })),
    },
  },
})

await builder.buildAllPlatforms()
