import { Button, type ButtonState, SettingsSvg } from '@ds/core'
import { t } from 'i18next'

interface Props extends ReactProps {
  iconWidth: string
  collapsed?: boolean
  state?: ButtonState
  onClick?: () => void
}

export const SettingsButton = ({ iconWidth, collapsed, state, onClick, className }: Props) => {
  return (
    <Button
      variant="menu-default"
      size="lg"
      className={cx('w-full', className)}
      data-testid="settings-button"
      state={state}
      onClick={onClick}
    >
      <SettingsSvg className="h-xs-9" style={{ minWidth: iconWidth }} />

      {!collapsed && (
        <span className="ml-button-px-item leading-sm line-clamp-1 flex flex-col">{t('core.label.preferences')}</span>
      )}
    </Button>
  )
}
