import { LogoSvg } from '@ds/core.ts'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface Props extends ReactProps {
	mobile?: boolean
	collapsed?: boolean
}

export const AppLogo = ({ collapsed, mobile, className }: Props) => {
	const { t } = useTranslation()

	return (
		<Link href="/" className={cx('p-xs-3 text-color-primary-page-text flex w-fit', className)}>
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
