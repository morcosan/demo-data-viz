import { EmptyState } from '@app-components'
import { useTranslation } from '@app-i18n'
import { type TableData } from '@app/shared/types/table'
import { type ReactNode } from 'react'

interface Props extends ReactProps {
  data: TableData
  query: string
  cellFn: (value: string, query: string) => ReactNode
}

export const MapView = (props: Props) => {
  const { t } = useTranslation()

  return (
    <div className={cx('flex-center flex h-full', props.className)}>
      <EmptyState type="error">{t('dataViz.error.noMapForDataset')}</EmptyState>
    </div>
  )
}
