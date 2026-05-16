import { rmSync } from 'fs'
import _ from 'lodash'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import StyleDictionary from 'style-dictionary'
import { TOKENS } from '../../src/styles/tokens/index.ts'
import { FORMAT_NAME, formatTokens } from './_format.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outDir = path.join(__dirname, '../../src/styles/tokens/_css')

// Clear folder
rmSync(outDir, { recursive: true, force: true })

const builder = new StyleDictionary({
  tokens: formatTokens(TOKENS),
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds', // As in '--ds-' for CSS vars
      buildPath: outDir,
      options: { outputReferences: true },
      files: Object.keys(TOKENS).map((name: string) => ({
        destination: `${_.kebabCase(name)}.css`,
        format: FORMAT_NAME,
        filter: (token) => token.path[0] === name,
      })),
    },
  },
})

await builder.buildAllPlatforms()
