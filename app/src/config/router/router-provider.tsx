'use client'

import { RoutingService } from '@ds/core.ts'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const RouterProvider = ({ children }: ReactProps) => {
	const router = useRouter()

	const navigate = useCallback((path: string) => router.push(path), [router])

	return <RoutingService navigate={navigate}>{children}</RoutingService>
}
