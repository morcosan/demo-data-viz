'use client'

export interface NavMenuProps extends ReactProps {
	/** Callback to close the menu on mobile (no effect on desktop) */
	closeMenu: () => void
}

/** Content to be rendered as navigation */
export const NavMenu = (props: NavMenuProps) => {
	return <div className={props.className}>menu</div>
}
