import { buildGeoJson } from './geo-json/bundler.ts'
import { startNoCorsProxy } from './no-cors-proxy/server.ts'
import { buildWebWorkers } from './web-workers/bundler.ts'

startNoCorsProxy()
buildGeoJson()
buildWebWorkers(true)
