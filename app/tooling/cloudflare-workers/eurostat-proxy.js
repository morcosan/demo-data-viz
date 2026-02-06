const isAllowedOrigin = (origin) => {
	try {
		const url = new URL(origin)
		const hostname = url.hostname
		return hostname === 'morco.ro' || hostname.endsWith('.morco.ro') // || hostname === 'localhost'
	} catch {
		return false
	}
}

const getTargetUrl = (req) => {
	return new URL(req.url).searchParams.get('url')
}

const isAllowedTarget = (target) => {
	try {
		return new URL(target).hostname === 'ec.europa.eu'
	} catch {
		return false
	}
}

const handleOptions = () => {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,OPTIONS',
		'Access-Control-Allow-Headers': '*',
	}
	return new Response(null, { headers: corsHeaders })
}

const handleError = (msg, status = 400) => {
	return new Response(msg, { status })
}

const proxyFetch = async (target, origin) => {
	const upstream = await fetch(target)
	const headers = new Headers(upstream.headers)
	headers.set('Access-Control-Allow-Origin', origin)
	return new Response(upstream.body, {
		status: upstream.status,
		headers,
	})
}

const worker = {
	fetch: async (req) => {
		if (req.method === 'OPTIONS') return handleOptions()

		const origin = req.headers.get('Origin') || ''
		if (!isAllowedOrigin(origin)) return handleError('Forbidden origin', 403)

		const target = getTargetUrl(req)
		if (!target) return handleError('Missing url', 400)
		if (!isAllowedTarget(target)) return handleError('Forbidden target', 403)

		try {
			return await proxyFetch(target, origin)
		} catch (err) {
			return handleError(String(err), 502)
		}
	},
}

export default worker
