import type { FC } from 'react'

export interface AppLogoProps {
	mobile?: boolean
	collapsed?: boolean
}
export interface NavMenuProps {
	closeMenu: () => void
}
export type AppLogo = FC<AppLogoProps>
export type NavMenu = FC<NavMenuProps>
