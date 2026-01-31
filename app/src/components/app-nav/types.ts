import { AppLogo } from '../app-logo/app-logo.tsx'

export interface NavMenuProps {
	closeMenu: () => void
}
export type AppLogo = typeof AppLogo
export type NavMenu = React.FC<NavMenuProps>
