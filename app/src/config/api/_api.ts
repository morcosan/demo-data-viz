const API = {
	async get(input: string): Promise<Response> {
		const res = await fetch(input)

		if (res.ok) return res
		throw new Error('Network response was not ok')
	},

	async post(input: string, payload: unknown): Promise<Response> {
		const res = await fetch(input, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})

		if (res.ok) return res
		throw new Error('Network response was not ok')
	},

	async patch(input: string, payload: unknown): Promise<Response> {
		const res = await fetch(input, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})

		if (res.ok) return res
		throw new Error('Network response was not ok')
	},
}

export { API }
