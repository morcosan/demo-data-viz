import { useTranslation } from '@app-i18n'
import { type Dataset } from '@app/app/datasets/_types'
import { formatDate, formatNumber } from '@app/shared/utils/formatting'
import { type TableConst } from '@app/shared/utils/json-stat/index'
import { Modal } from '@ds/core'

interface Props {
  opened: boolean
  dataset?: Dataset
  onClose?: () => void
}

export const DatasetModal = (props: Props) => {
  const { dataset } = props
  const { t } = useTranslation()

  const headerClass = cx(
    // Header
    'mb-xs-3 pb-xs-1 relative',
    'text-size-xs font-weight-sm text-color-text-subtle tracking-wider uppercase',
    // Underline
    'after:absolute after:bottom-0 after:left-0',
    'after:bg-color-text-subtle after:w-xs-9 after:h-px',
  )
  const groupClass = cx(
    // Group
    'py-xs-7 gap-x-xs-9 grid grid-cols-1 items-center sm:grid-cols-[30%_minmax(0,1fr)]',
    'border-color-border-subtle border-b last:border-0',
    // Items
    '[&>dt]:text-size-sm [&>dt]:text-color-text-subtle [&>dd]:font-weight-lg',
  )

  if (!dataset) return null
  return (
    <Modal opened={props.opened} title={t('dataViz.label.datasetDetails')} width="sm" noFooter onClose={props.onClose}>
      {/* METADATA */}
      <section>
        <h2 className={headerClass}>{t('dataViz.header.metadata')}</h2>
        <dl>
          <div className={groupClass}>
            <dt>{t('dataViz.label.dataSize')}</dt>
            <dd>
              {formatNumber(dataset.stats?.colsCount)} x {formatNumber(dataset.stats?.rowsCount)}
            </dd>
          </div>

          <div className={groupClass}>
            <dt>{t('dataViz.label.source')}</dt>
            <dd>
              {dataset.source === 'eurostat' && <span className="fi fi-eu shadow-xs" />}
              <span className="ml-xs-1">{dataset.source === 'eurostat' ? 'Eurostat' : 'Unknown'}</span>
            </dd>
          </div>

          <div className={groupClass}>
            <dt>{t('dataViz.label.lastUpdate')}</dt>
            <dd>{formatDate(dataset.updatedAt)}</dd>
          </div>

          <div className={groupClass}>
            <dt>{t('dataViz.label.datasetId')}</dt>
            <dd>{dataset.id}</dd>
          </div>
        </dl>
      </section>

      {/* CONSTANTS */}
      {dataset.constants.length > 0 && (
        <section className="mt-sm-7">
          <h2 className={headerClass}>{t('dataViz.header.constants')}</h2>
          <dl>
            {dataset.constants.map((constant: TableConst) => (
              <div key={constant.key} className={groupClass}>
                <dt>{constant.label}</dt>
                <dd>{constant.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </Modal>
  )
}
