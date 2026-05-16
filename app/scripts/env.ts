import dotenv from 'dotenv'

dotenv.config({ path: '.env', quiet: true })
dotenv.config({ path: '.env.local', override: true, quiet: true })

export const initEnv = (): Record<string, string | undefined> => ({
  ...process.env,
  PUBLIC__BASE_URL: process.env.PUBLIC__BASE_URL,
  PUBLIC__BASE_PATH: process.env.PUBLIC__BASE_PATH,
  PUBLIC__EUROSTAT_BASE_URL: process.env.PUBLIC__EUROSTAT_BASE_URL,
  LOCAL__BASE_PATH: process.env.LOCAL__BASE_PATH,
  LOCAL__EUROSTAT_PORT: process.env.LOCAL__EUROSTAT_PORT,
  LOCAL__EUROSTAT_BASE_URL: process.env.LOCAL__EUROSTAT_BASE_URL,
  LOCAL__APP_PORT: process.env.LOCAL__APP_PORT,
  LOCAL__APP_OUT_DIR: process.env.LOCAL__APP_OUT_DIR,
  LOCAL__E2E_LIVE_OUT_DIR: process.env.LOCAL__E2E_LIVE_OUT_DIR,
  LOCAL__E2E_LOCAL_OUT_DIR: process.env.LOCAL__E2E_LOCAL_OUT_DIR,
  LOCAL__STORYBOOK_PORT: process.env.LOCAL__STORYBOOK_PORT,
  LOCAL__STORYBOOK_OUT_DIR: process.env.LOCAL__STORYBOOK_OUT_DIR,
  USE_LOCAL: process.env.USE_LOCAL,
})
