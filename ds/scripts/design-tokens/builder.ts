import { readFileSync, rmSync } from 'fs'
import { kebabCase } from 'lodash-es'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { createCssFormat } from './_css-format.ts'
import { createTsFormat } from './_ts-format.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FORMAT_NAME__CSS = 'css/ds-format'
const FORMAT_NAME__TS = 'ts/ds-format'
const outDir = path.join(__dirname, '../../src/styles/tokens/_dist')
const tokensFile = path.join(__dirname, '../../src/styles/tokens/_src/tokens.json')
const tokensJson = JSON.parse(readFileSync(tokensFile, 'utf-8'))

// Clear folder
rmSync(outDir, { recursive: true, force: true })

const sd = new StyleDictionary({
  tokens: tokensJson,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: outDir,
      options: { outputReferences: true },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${kebabCase(name)}.css`,
        format: FORMAT_NAME__CSS,
        filter: (token) => token.path[0] === name,
      })),
    },
    ts: {
      transformGroup: 'css',
      buildPath: outDir,
      options: { outputReferences: false },
      files: Object.keys(tokensJson).map((name: string) => ({
        destination: `${kebabCase(name)}.ts`,
        format: FORMAT_NAME__TS,
        filter: (token) => token.path[0] === name,
      })),
    },
  },
  log: { verbosity: 'verbose', warnings: 'disabled' },
})

sd.registerFormat({ ...createCssFormat(), name: FORMAT_NAME__CSS })
sd.registerFormat({ ...createTsFormat(sd), name: FORMAT_NAME__TS })

await sd.buildAllPlatforms()
