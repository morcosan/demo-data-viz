import { QueryClient, useQuery as useReactQuery, type UseQueryOptions } from '@tanstack/react-query'

const useQuery = <T>(options: UseQueryOptions<T>, queryClient?: QueryClient) => {
  const { data, isLoading, error } = useReactQuery<T>(options, queryClient)
  const arr = [data, isLoading, error] as const as [T | undefined, boolean, Error | null]

  return Object.assign(arr, { data, isLoading, error })
}

export { useMutation, useQueryClient } from '@tanstack/react-query'
export * from './_api'
export * from './_query-keys'
export * from './_query-provider'
export { useQuery }
