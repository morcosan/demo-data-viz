'use client'

import { LogoSvg } from '@ds/core.ts'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export interface AppLogoProps extends ReactProps {
	/** Flag for rendering the logo on mobile  */
	mobile?: boolean
	/** Flag for rendering the logo as collapsed on desktop (no effect on mobile) */
	collapsed?: boolean
}

/** App logo to be rendered on top of navigation */
export const AppLogo = ({ collapsed, mobile, className }: AppLogoProps) => {
	const { t } = useTranslation()

	return (
		<Link href="/public" className={cx('p-xs-3 text-color-primary-page-text flex w-fit', className)}>
			{mobile ? (
				<span className="flex items-center">
					<LogoSvg className="mr-xs-3 h-sm-0 w-sm-0 animate-pulse" />
					<span className="font-weight-md">{t('core.label.appTitle')}</span>
				</span>
			) : (
				<>
					<LogoSvg className="h-sm-2 w-sm-2 animate-pulse" />
					<span className={cx('font-weight-md truncate leading-1', collapsed && 'hidden')}>
						{t('core.label.appTitle')}
					</span>
				</>
			)}
		</Link>
	)
}
