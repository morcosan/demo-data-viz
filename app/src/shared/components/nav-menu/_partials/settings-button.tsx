import { Button, type ButtonHighlight, SettingsSvg } from '@ds/core.ts'
import { t } from 'i18next'

interface Props extends ReactProps {
	iconWidth: string
	collapsed?: boolean
	highlight?: ButtonHighlight
	onClick?(): void
}

export const SettingsButton = (props: Props) => {
	return (
		<Button
			variant="item-text-default"
			size="lg"
			className={cx('w-full', props.className)}
			highlight={props.highlight}
			onClick={props.onClick}
		>
			<SettingsSvg className="h-xs-9" style={{ minWidth: props.iconWidth }} />

			{!props.collapsed && (
				<span className="ml-button-px-item leading-sm line-clamp-1 flex flex-col">
					{t('core.label.preferences')}
				</span>
			)}
		</Button>
	)
}
