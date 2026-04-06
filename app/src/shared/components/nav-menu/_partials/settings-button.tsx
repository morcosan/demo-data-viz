import { Button, type ButtonHighlight, SettingsSvg } from '@ds/core'
import { t } from 'i18next'

interface Props extends ReactProps {
  iconWidth: string
  collapsed?: boolean
  highlight?: ButtonHighlight
  onClick?: () => void
}

export const SettingsButton = ({ iconWidth, collapsed, highlight, onClick, className }: Props) => {
  return (
    <Button
      variant="item-text-default"
      size="lg"
      className={cx('w-full', className)}
      highlight={highlight}
      onClick={onClick}
    >
      <SettingsSvg className="h-xs-9" style={{ minWidth: iconWidth }} />

      {!collapsed && (
        <span className="ml-button-px-item leading-sm line-clamp-1 flex flex-col">{t('core.label.preferences')}</span>
      )}
    </Button>
  )
}
