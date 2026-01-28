import { IconButton, MenuSvg } from '@ds/core.ts'
import { useTranslation } from 'react-i18next'
import { AppLogo } from './_app-logo.tsx'

interface Props {
	hasMenu: boolean
	onToggleNavMenu(): void
}

export const MobileTopbar = ({ hasMenu, onToggleNavMenu }: Props) => {
	const { t } = useTranslation()

	return (
		<nav
			aria-label={t('core.label.navigationBar')}
			className="z-navbar border-color-border-shadow fixed top-0 left-0 w-full border-t shadow-sm"
			style={{ minHeight: 'var(--app-spacing-navbar-h)', height: 'var(--app-spacing-navbar-h)' }}
		>
			<div className="bg-color-bg-card px-xs-2 flex h-full items-center">
				{/* MENU */}
				<IconButton tooltip={t('core.action.openMenu')} pressed={hasMenu} onClick={onToggleNavMenu}>
					<MenuSvg className="h-xs-9" />
				</IconButton>

				{/* LOGO */}
				<AppLogo className="ml-xs-3" mobile />
			</div>
		</nav>
	)
}
