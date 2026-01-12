'use client'

import { createContext, useContext, useMemo } from 'react'

/**
 * Context
 */
type NavigateFn = (path: string) => void
type Store = {
	navigate: NavigateFn
}
const Context = createContext<Store>({
	navigate: () => {},
})
const useRoutingService = () => useContext(Context)

/**
 * Provider
 */
interface Props extends ReactProps {
	navigate: NavigateFn
}

const RoutingService = ({ navigate, children }: Props) => {
	const store: Store = useMemo(
		() => ({
			navigate,
		}),
		[navigate]
	)

	return <Context.Provider value={store}>{children}</Context.Provider>
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { RoutingService, useRoutingService }
