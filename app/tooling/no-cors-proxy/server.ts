import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const PORT = 8666

createServer(async (req: IncomingMessage, res: ServerResponse) => {
	// CORS (allow everything)
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', '*')

	const url = new URL(req.url ?? '/', 'http://localhost')
	const target = url.searchParams.get('url')
	if (!target) {
		res.statusCode = 400
		return res.end('Missing url')
	}

	try {
		const upstream = await fetch(target)

		res.statusCode = upstream.status
		res.setHeader('content-type', upstream.headers.get('content-type') ?? 'application/octet-stream')

		if (!upstream.body) return res.end()

		// Convert web stream -> Node stream and pipe to response
		await pipeline(Readable.fromWeb(upstream.body as any), res)
	} catch (err) {
		res.statusCode = 502
		res.end(String(err))
	}
}).listen(PORT)

console.log(`No CORS Proxy at http://localhost:${PORT}/?url=...`)
