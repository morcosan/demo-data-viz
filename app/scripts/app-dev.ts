import { startNoCorsProxy } from './no-cors-proxy/server.ts'
import { buildWebWorkers } from './web-workers/bundler.ts'

startNoCorsProxy()
buildWebWorkers(true)
