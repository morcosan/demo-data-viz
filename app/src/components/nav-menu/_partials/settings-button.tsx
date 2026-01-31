import { Button, type ButtonHighlight, SettingsSvg } from '@ds/core.ts'
import { t } from 'i18next'

interface Props {
	highlight?: ButtonHighlight
	onClick?(): void
}

export const SettingsButton = ({ highlight, onClick }: Props) => {
	return (
		<Button
			variant="item-text-default"
			size="lg"
			className="mt-xs-1 w-full text-left"
			highlight={highlight}
			onClick={onClick}
		>
			<SettingsSvg className="mr-button-px-item h-sm-0 min-w-sm-2" />

			<span className="leading-sm line-clamp-1 flex flex-col">
				<span className="text-size-sm mb-px line-clamp-1 w-full">{t('core.label.settings')}</span>

				<span className="pb-xs-0 text-size-xs text-color-text-subtle line-clamp-1 w-full break-all">
					{t('core.label.andMore')}
				</span>
			</span>
		</Button>
	)
}
