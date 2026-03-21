import { useTranslation } from '@app-i18n'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import { type JsonStatConst } from '@app/shared/utils/json-stat/index'
import { Modal } from '@ds/core'
import { SettingSection } from '../_partials/setting-section'
import { type Dataset } from '../_types'

interface Props {
  opened: boolean
  dataset?: Dataset
  onClose?: () => void
}

export const DetailsModal = (props: Props) => {
  const { t } = useTranslation()
  const { dataset } = props

  if (!dataset) return null
  return (
    <Modal opened={props.opened} title={t('dataViz.label.datasetDetails')} width="sm" noFooter onClose={props.onClose}>
      {/* METADATA */}
      <SettingSection header={t('dataViz.label.headerMetadata')}>
        <div>
          <dt>{t('core.label.dataSize')}</dt>
          <dd>
            {formatNumber(dataset.stats?.colsCount)} x {formatNumber(dataset.stats?.rowsCount)}
          </dd>
        </div>
        <div>
          <dt>{t('core.label.source')}</dt>
          <dd>
            {dataset.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
            <span className="ml-xs-1">
              {dataset.source === 'eurostat' ? t('dataViz.label.eurostat') : t('core.label.unknown')}
            </span>
          </dd>
        </div>
        <div>
          <dt>{t('core.label.lastUpdate')}</dt>
          <dd>{formatDate(dataset.updatedAt)}</dd>
        </div>
        <div>
          <dt>{t('core.label.datasetId')}</dt>
          <dd>{dataset.id}</dd>
        </div>
      </SettingSection>

      {/* CONSTANTS */}
      {dataset.constants.length > 0 && (
        <SettingSection header={t('dataViz.label.headerConstants')} className="mt-sm-7">
          {dataset.constants.map((constant: JsonStatConst) => (
            <div key={constant.key}>
              <dt>{constant.label}</dt>
              <dd>{constant.value}</dd>
            </div>
          ))}
        </SettingSection>
      )}
    </Modal>
  )
}
