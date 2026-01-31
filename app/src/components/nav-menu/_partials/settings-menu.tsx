'use client'

import {
	ArrowBackSvg,
	Button,
	GithubBlackSvg,
	GithubWhiteSvg,
	IconButton,
	NewTabSvg,
	SettingsSvg,
	StorybookSvg,
	useThemeService,
} from '@ds/core.ts'
import { t } from 'i18next'

interface Props {
	onClickBack?(): void
}

export const SettingsMenu = ({ onClickBack }: Props) => {
	const { isUiLight, isUiDark, changeColorTheme } = useThemeService()

	const isLocal = location.hostname === 'localhost'
	const appStorybookUrl = isLocal ? 'http://localhost:6006' : `${ENV__BASE_PATH}/storybook`
	const dsStorybookUrl = isLocal ? 'http://localhost:9000' : `${ENV__BASE_PATH}/design-system`

	const hrClass = 'my-xs-1'
	const actionIconClass = 'mr-button-px-item h-xs-8 w-xs-8'
	const newTabIconClass = 'ml-auto mr-px min-w-xs-6 w-xs-6 text-color-text-subtle'

	return (
		<div className="gap-xs-3 p-xs-4 flex h-full w-full flex-col">
			{/* BACK BUTTON */}
			{Boolean(onClickBack) && (
				<div className="mb-sm-0 mt-xs-3 gap-xs-3 flex items-center">
					<IconButton tooltip={t('core.action.back')} onClick={onClickBack}>
						<ArrowBackSvg className="h-xs-7" />
					</IconButton>
					<span className="pb-xs-0 text-size-lg">{t('core.label.quickSettings')}</span>
				</div>
			)}

			{/* THEME */}
			<div className="px-button-px-item flex items-center justify-between">
				<span id="ui-theme">{t('core.label.theme')}</span>

				<div role="group" aria-labelledby="ui-theme" className="gap-xs-1 flex flex-col">
					<Button
						variant={isUiLight ? 'solid-secondary' : 'text-default'}
						size="xs"
						onClick={() => changeColorTheme('light')}
					>
						☀️ {t('core.label.themeLight')}&nbsp;
					</Button>
					<Button
						variant={isUiDark ? 'solid-secondary' : 'text-default'}
						size="xs"
						onClick={() => changeColorTheme('dark')}
					>
						🌙 {t('core.label.themeDark')}&nbsp;
					</Button>
				</div>
			</div>

			<hr className={hrClass} />

			{/* APP STORYBOOK */}
			<Button linkHref={appStorybookUrl} linkType="external" variant="item-text-default">
				<StorybookSvg className={actionIconClass} />
				{t('core.label.appStorybook')}
				<NewTabSvg className={newTabIconClass} />
			</Button>

			{/* DS STORYBOOK */}
			<Button linkHref={dsStorybookUrl} linkType="external" variant="item-text-default">
				<StorybookSvg className={actionIconClass} />
				{t('core.label.dsStorybook')}
				<NewTabSvg className={newTabIconClass} />
			</Button>

			{/* REPO */}
			<Button linkHref="https://github.com/morcosan/demo-data-viz" linkType="external" variant="item-text-default">
				{Boolean(isUiLight) && <GithubBlackSvg className={actionIconClass} />}
				{Boolean(isUiDark) && <GithubWhiteSvg className={actionIconClass} />}
				{t('core.label.githubRepo')}
				<NewTabSvg className={newTabIconClass} />
			</Button>

			<hr className={hrClass} />

			{/* SETTINGS */}
			<Button linkHref="/settings" variant="item-text-default">
				<SettingsSvg className={actionIconClass} />
				{t('core.label.settings')}
			</Button>
		</div>
	)
}
