'use client'

import { QueryKey, useMutation, useQuery, useQueryClient } from '@app-api'

type ErrorFn = (error: Error) => void

function useLocalStorage<T>(key: string, onError?: ErrorFn) {
	const queryClient = useQueryClient()
	const queryKey = [QueryKey.LOCAL_STORAGE, key]

	// Read from localStorage
	const query = useQuery<T | null>({
		queryKey,
		queryFn: () => {
			try {
				const item = localStorage.getItem(key)
				if (!item) return null
				return JSON.parse(item)
			} catch (error) {
				onError?.(error as Error)
				return null
			}
		},
	})

	// Write to localStorage
	const setItem = useMutation({
		mutationFn: async (newData: T) => {
			try {
				localStorage.setItem(key, JSON.stringify(newData))
				return newData
			} catch (error) {
				if (error instanceof Error && error.name === 'QuotaExceededError') {
					throw new Error('LocalStorage quota exceeded')
				}
				throw error
			}
		},
		onSuccess: (data) => queryClient.setQueryData(queryKey, data),
		onError: (error) => onError?.(error as Error),
	})

	// Remove from localStorage
	const removeItem = useMutation({
		mutationFn: async () => localStorage.removeItem(key),
		onSuccess: () => queryClient.setQueryData(queryKey, null),
		onError: (error) => onError?.(error as Error),
	})

	// Clear all localStorage
	const clearAll = useMutation({
		mutationFn: async () => localStorage.clear(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.LOCAL_STORAGE] }),
		onError: (error) => onError?.(error as Error),
	})

	return {
		// Query state
		data: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,

		// Mutations
		setItem: setItem.mutate,
		setItemAsync: setItem.mutateAsync,
		removeItem: removeItem.mutate,
		removeItemAsync: removeItem.mutateAsync,
		clearAll: clearAll.mutate,
		clearAllAsync: clearAll.mutateAsync,

		// Mutation states
		isSaving: setItem.isPending,
		isRemoving: removeItem.isPending,
		saveError: setItem.error,
		removeError: removeItem.error,
	}
}

export { useLocalStorage }
