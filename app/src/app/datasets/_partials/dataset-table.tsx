import { DataTable, type SelectValue, TextHighlight } from '@app-components'
import { useCountries, useTranslation } from '@app-i18n'
import { type TableRowValue } from '@app/shared/types/table'
import { EUROSTAT_COL_KEY, EUROSTAT_ROW_KEY, JSON_STAT_VALUE_KEY, type JsonStatData } from '@app/shared/utils/json-stat'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { TableToolbar } from './table-toolbar'

interface Props extends ReactProps {
  data: JsonStatData
}

export const DatasetTable = (props: Props) => {
  const { t } = useTranslation()
  const { getCountryCode } = useCountries()
  const { valuesByCol } = props.data
  const [rowKey, setRowKey] = useState<string>(valuesByCol[EUROSTAT_ROW_KEY] ? EUROSTAT_ROW_KEY : '')
  const [colKey, setColKey] = useState<string>(valuesByCol[EUROSTAT_COL_KEY] ? EUROSTAT_COL_KEY : '')
  const getFilterByCol = () => {
    return Object.keys(valuesByCol).reduce((acc, key) => ({ ...acc, [key]: valuesByCol[key][0] || null }), {})
  }
  const [filterByCol, setFilterByCol] = useState<Record<string, SelectValue>>(getFilterByCol())
  const tableData = useMemo(() => {
    return {
      ...props.data,
      cols: props.data.cols
        .filter((col) => col.key === rowKey || col.key === colKey || col.key === JSON_STAT_VALUE_KEY)
        .map((col) => ({
          ...col,
          label: col.key === JSON_STAT_VALUE_KEY ? t('dataViz.label.colValue') : col.label,
        })),
    }
  }, [rowKey, colKey, filterByCol])

  const cellFn = (value: TableRowValue, query: string): ReactNode => {
    const text = String(value ?? '')
    const flag = getCountryCode(text)
    return (
      <>
        {flag && <span className={`fi fi-${flag} mr-xs-2 shadow-xs`} />}
        <TextHighlight text={text} query={query} />
      </>
    )
  }

  const handleFilter = useCallback((key: string, value: SelectValue) => {
    setFilterByCol((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <DataTable
      data={tableData}
      cellFn={cellFn}
      toolbar={
        <TableToolbar
          data={props.data}
          rowKey={rowKey}
          colKey={colKey}
          filterByCol={filterByCol}
          onChangeRowKey={setRowKey}
          onChangeColKey={setColKey}
          onChangeFilter={handleFilter}
        />
      }
      className={props.className}
    />
  )
}
