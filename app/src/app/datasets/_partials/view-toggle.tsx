import { useTranslation } from '@app-i18n'
import { ChartSvg, MapSvg, TableSvg } from '@app/shared/assets'
import { Button } from '@ds/core'
import { type DataView } from '../_types'

interface Props {
  view: DataView
  setDatasetView: (view: DataView) => void
}

export const ViewToggle = (props: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={cx(
        'p-xs-1 gap-xs-0 ml-auto flex h-fit self-end',
        'bg-color-bg-field border-color-border-subtle rounded-md border',
      )}
    >
      <Button
        variant={props.view === 'table' ? 'solid-secondary' : 'text-default'}
        size="sm"
        onClick={() => props.setDatasetView('table')}
      >
        <TableSvg className="h-xs-6 mr-xs-1 -mt-xs-1" />
        {t('dataViz.label.viewTable')}
      </Button>
      <Button
        variant={props.view === 'chart' ? 'solid-secondary' : 'text-default'}
        size="sm"
        onClick={() => props.setDatasetView('chart')}
      >
        <ChartSvg className="h-xs-6 mr-xs-1 -mt-xs-1" />
        {t('dataViz.label.viewChart')}
      </Button>
      <Button
        variant={props.view === 'map' ? 'solid-secondary' : 'text-default'}
        size="sm"
        onClick={() => props.setDatasetView('map')}
      >
        <MapSvg className="h-xs-6 mr-xs-1 -mt-xs-1" />
        {t('dataViz.label.viewMap')}
      </Button>
    </div>
  )
}
