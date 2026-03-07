import { useTranslation } from '@app-i18n'
import type { TableCol } from '@app/shared/types/table'
import { type JsonStatData } from '@app/shared/utils/json-stat'
import { Modal } from '@ds/core'

interface Props {
  opened: boolean
  data: JsonStatData
  colKeys: string[]
  rowKey: string
  colKey: string
  onClose: () => void
}

export const FiltersModal = (props: Props) => {
  const { t } = useTranslation()
  const cols = props.colKeys
    .filter((key) => key !== props.colKey && key !== props.rowKey)
    .map((key) => props.data.cols.find((col) => col.key === key))
    .filter(Boolean) as TableCol[]

  const groupClass = cx(
    // Group
    'py-xs-7 gap-x-xs-9 grid grid-cols-1 items-center sm:grid-cols-[40%_minmax(0,1fr)]',
    'border-color-border-subtle border-b last:border-0',
    // Items
    '[&>dt]:text-size-sm [&>dt]:text-color-text-subtle [&>dd]:font-weight-lg',
  )

  return (
    <Modal opened={props.opened} width="sm" title={t('dataViz.label.filtersTitle')} noFooter onClose={props.onClose}>
      <dl>
        {cols.map((col: TableCol) => (
          <div className={groupClass}>
            <dt>{col.label}</dt>
            <dd>--</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}
