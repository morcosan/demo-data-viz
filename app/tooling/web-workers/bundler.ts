import { build, type BuildOptions, context, type OnResolveArgs, type Plugin } from 'esbuild'
import { glob } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const srcPath = path.join(dirname, '../../src')
const dsPath = path.join(dirname, '../../../ds/dist')

const aliasPlugin: Plugin = {
  name: 'alias-plugin',
  setup(build) {
    const aliases: [RegExp, string][] = [
      [/^@app-components$/, path.resolve(srcPath, 'shared/components/index.ts')],
      [/^@app-i18n$/, path.resolve(srcPath, 'core/i18n/index.ts')],
      [/^@app-api$/, path.resolve(srcPath, 'core/api/index.ts')],
      [/^@app\//, srcPath], // Alias: @app/*
      [/^@ds\//, dsPath], // Alias: @ds/*
    ]
    for (const [filter, base] of aliases) {
      build.onResolve({ filter }, async (args: OnResolveArgs) => {
        const resolved = args.path.match(/\//) ? path.resolve(base, args.path.replace(filter, '')) : base

        return path.extname(resolved)
          ? { path: resolved }
          : await build.resolve(resolved, { kind: args.kind, resolveDir: path.dirname(resolved) })
      })
    }
  },
}

const options: BuildOptions = {
  entryPoints: (await Array.fromAsync(glob('src/**/*.worker.ts'))).map((entry: string) => ({
    in: entry,
    out: path.basename(entry, '.ts'),
  })),
  outdir: 'public/workers',
  bundle: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.ENV__BASE_PATH': JSON.stringify(''),
    'process.env.ENV__BUILD_NUMBER': JSON.stringify(''),
    'process.env.ENV__EUROSTAT_BASE_URL': JSON.stringify(''),
  },
  plugins: [aliasPlugin],
}

const buildWebWorkers = async (watch?: boolean) => {
  console.log(`Building web workers... ${watch ? 'Watching...' : ''}\n`)
  if (watch) {
    const ctx = await context(options)
    await ctx.watch()
  } else {
    await build(options)
  }
}

export { buildWebWorkers }
