'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
		},
	},
})

export const ApiProvider = ({ children }: ReactProps) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
