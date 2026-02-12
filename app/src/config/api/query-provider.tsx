'use client'

import { ENV__IS_LOCALHOST } from '@app/env.ts'
import { Query, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			retry: ENV__IS_LOCALHOST ? 0 : 3,
		},
	},
	queryCache: new QueryCache({
		onError: (error: unknown, query: Query<unknown, unknown, unknown>) => {
			console.error(`Query Error ${JSON.stringify(query.queryKey)}\n`, error)
		},
	}),
})

export const QueryProvider = ({ children }: ReactProps) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
