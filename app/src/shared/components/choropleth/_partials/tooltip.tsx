import { useTranslation } from '@app-i18n'
import { formatNumber } from '@app/shared/utils/formatting'
import type { ReactNode } from 'react'

interface Props {
  name: string
  value: number
  nameFn: (value: string) => ReactNode
}

export const Tooltip = ({ name, nameFn, value }: Props) => {
  const { t } = useTranslation()
  const title = nameFn(String(name)) || name
  const hasValue = value !== undefined && !isNaN(value)

  return (
    <div
      className={cx(
        'px-xs-5 py-xs-3 min-w-md-9 rounded-sm',
        'bg-color-bg-menu border-color-border-shadow border shadow-md',
        'text-size-sm',
      )}
    >
      <div className="font-weight-lg mb-xs-2" aria-label={`${name},`}>
        {title}
      </div>
      {hasValue ? (
        <div className="font-family-mono">{formatNumber(value as number)}</div>
      ) : (
        <div className="text-size-xs text-color-text-subtle">{t('dataViz.error.noDataForCountry')}</div>
      )}
    </div>
  )
}
