'use client'

import { useTranslation } from '@app-i18n'
import { ENV__BASE_PATH } from '@app/env'
import { PlaywrightSvg } from '@app/shared/assets'
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
} from '@ds/core'
import { useId } from 'react'

interface Props {
  closeMenuFn: () => void
  onClickBack?: () => void
}

export const SettingsMenu = ({ closeMenuFn, onClickBack }: Props) => {
  const { t } = useTranslation()
  const { isUiLight, isUiDark, changeColorTheme } = useThemeService()
  const fieldId = useId()

  const isPopup = !onClickBack
  const appStorybookUrl = `${ENV__BASE_PATH}/storybook`
  const dsStorybookUrl = `${ENV__BASE_PATH}/design-system`
  const e2eTestsUrl = `${ENV__BASE_PATH}/e2e-tests`

  const hrClass = 'my-xs-1'
  const actionIconClass = cx('mr-button-px-item h-xs-8 w-xs-8')
  const newTabIconClass = cx('min-w-xs-6 w-xs-6 text-color-text-subtle mr-px ml-auto')

  return (
    <div className={cx('gap-xs-3 flex w-full flex-1 flex-col', isPopup && 'p-xs-4')}>
      {/* BACK BUTTON */}
      {!isPopup && (
        <div className="mb-sm-0 gap-xs-3 flex items-center">
          <IconButton tooltip={t('core.action.back')} onClick={onClickBack}>
            <ArrowBackSvg className="h-xs-7" />
          </IconButton>
          <span className="text-size-lg">{t('core.label.preferences')}</span>
        </div>
      )}

      {/* THEME */}
      <div className="px-button-px-item flex items-center justify-between">
        <span id={`${fieldId}-theme`}>{t('core.label.theme')}</span>

        <div
          role="group"
          aria-labelledby={`${fieldId}-theme`}
          className="gap-xs-1 flex flex-col"
          data-testid="color-theme-toggle"
        >
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

      {/* DS STORYBOOK */}
      <Button linkHref={dsStorybookUrl} linkType="external" variant="item-text-default">
        <StorybookSvg className={actionIconClass} />
        {t('core.label.dsStorybook')}
        <NewTabSvg className={newTabIconClass} />
      </Button>

      {/* APP STORYBOOK */}
      <Button linkHref={appStorybookUrl} linkType="external" variant="item-text-default">
        <StorybookSvg className={actionIconClass} />
        {t('core.label.appStorybook')}
        <NewTabSvg className={newTabIconClass} />
      </Button>

      {/* E2E TESTS */}
      <Button linkHref={e2eTestsUrl} linkType="external" variant="item-text-default">
        <PlaywrightSvg className={cx(actionIconClass, 'h-xs-9 w-xs-9 -ml-xs-0')} />
        {t('core.label.e2eTests')}
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
      <Button linkHref="/settings" variant="item-text-default" onClick={closeMenuFn}>
        <SettingsSvg className={actionIconClass} />
        {t('core.label.settings')}
      </Button>
    </div>
  )
}
