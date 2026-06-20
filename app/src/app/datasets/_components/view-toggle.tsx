import { useTranslation } from '@app-i18n'
import { ChartSvg, MapSvg, TableSvg } from '@app/shared/assets'
import { Button } from '@ds/core'
import { type DataView } from '../_types'

interface Props {
  view: DataView
  onChange: (view: DataView) => void
}

export const ViewToggle = ({ view, onChange }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={cx(
        'p-xs-1 gap-xs-0 ml-auto flex h-fit self-end',
        'bg-color-bg-field border-color-border-subtle rounded-max border',
      )}
    >
      <Button
        state={view === 'table' ? 'selected' : 'active'}
        variant="default"
        size="sm"
        onClick={() => onChange('table')}
      >
        <TableSvg className="h-xs-6 mr-xs-1" />
        {t('dataViz.label.viewTable')}
      </Button>

      <Button
        state={view === 'chart' ? 'selected' : 'active'}
        variant="default"
        size="sm"
        onClick={() => onChange('chart')}
      >
        <ChartSvg className="h-xs-6 mr-xs-1" />
        {t('dataViz.label.viewChart')}
      </Button>

      <Button
        state={view === 'map' ? 'selected' : 'active'}
        variant="default"
        size="sm"
        onClick={() => onChange('map')}
      >
        <MapSvg className="h-xs-6 mr-xs-1" />
        {t('dataViz.label.viewMap')}
      </Button>
    </div>
  )
}
