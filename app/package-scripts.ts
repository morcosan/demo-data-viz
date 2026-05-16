import chalk from 'chalk'
import { execSync } from 'child_process'
import { initEnv } from './scripts/env.ts'

initEnv()

const APP_PORT = Number(process.env.LOCAL__APP_PORT || 0)
const APP_OUT_DIR = process.env.LOCAL__APP_OUT_DIR || ''
const SB_PORT = Number(process.env.LOCAL__STORYBOOK_PORT || 0)
const SB_OUT_DIR = process.env.LOCAL__STORYBOOK_OUT_DIR || ''

const COMMANDS: Record<string, string> = {
  'app--dev': `concurrently "node scripts/app-dev.ts" "next dev --port ${APP_PORT}"`,
  'app--build': `node scripts/app-build.ts && next build`,
  'app--preview': `concurrently "node scripts/app-dev.ts" "vite preview --outDir ${APP_OUT_DIR} --port ${APP_PORT}"`,
  'app--test--ui-local': 'playwright test --config=tests/e2e-local.config.ts --ui',
  'app--test--ui-live': 'playwright test --config=tests/e2e-live.config.ts --ui',
  'app--test--ci-local': 'playwright test --config=tests/e2e-local.config.ts',
  'app--test--ci-live': 'playwright test --config=tests/e2e-live.config.ts',
  'app--clear-cache': 'rmdir /s /q .next',
  'sb--dev': `storybook dev --port ${SB_PORT} --no-open`,
  'sb--build': `storybook build -o ${SB_OUT_DIR}`,
  'sb--preview': `vite preview --outDir ${SB_OUT_DIR} --port ${SB_PORT}`,
  'sb--test': 'vitest --project=storybook',
  'code--build-geo': 'node scripts/geo-data/builder.ts',
  'code--lint': 'eslint . && tsc -b --noEmit',
} as const

const logCmd = (cmd: string) => console.log(chalk.ansi256(245)(`$ ${cmd}\n`))
const arg = process.argv[2]
const cmd = COMMANDS[arg]

if (arg && cmd) {
  logCmd(cmd)
  execSync(cmd, { stdio: 'inherit' })
} else {
  process.exit(1)
}
