import { useTranslation } from '@app-i18n'
import { formatNumber } from '@app/shared/utils/formatting'
import type { ReactNode } from 'react'

interface Props {
  name: string
  nameFn: (name: string, iso2: string) => ReactNode
  iso2: string
  value: number
}

export const Tooltip = ({ name, nameFn, iso2, value }: Props) => {
  const { t } = useTranslation()
  const hasValue = !isNaN(value)

  return (
    <div
      className={cx(
        'px-xs-5 py-xs-3 min-w-md-9 rounded-sm',
        'bg-color-bg-menu border-color-border-shadow border shadow-md',
        'text-size-sm',
      )}
    >
      <div className="font-weight-lg mb-xs-2" aria-label={`${name},`}>
        {nameFn(name, iso2)}
      </div>
      {hasValue ? (
        <div className="font-family-mono">{formatNumber(value as number)}</div>
      ) : (
        <div className="text-size-xs text-color-text-subtle">{t('dataViz.error.noDataForCountry')}</div>
      )}
    </div>
  )
}
