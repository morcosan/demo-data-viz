import type { BarChartData } from '@app-components'
import { useMemo, useState } from 'react'

interface Props {
  data: BarChartData
  barNames: Record<string, string>
  entryKey: string
}

export const useSorting = (props: Props) => {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | false>(false)
  const barKeys = Object.keys(props.barNames)

  const entries = useMemo(() => {
    const filtered = props.data.entries.filter((entry) => barKeys.some((key) => typeof entry[key] === 'number'))

    if (!sortKey || !sortDir) return filtered

    return filtered.sort((a, b) => {
      const numA = a[sortKey]
      const numB = b[sortKey]
      const strA = String(a[sortKey] ?? '')
      const strB = String(b[sortKey] ?? '')

      return typeof numA === 'number' && typeof numB === 'number'
        ? sortDir === 'asc'
          ? numA - numB
          : numB - numA
        : sortDir === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA)
    })
  }, [props.data.entries, barKeys, sortKey, sortDir])

  const toggleSort = (key: string) => {
    const mainDir = key === props.entryKey ? 'asc' : 'desc'
    const secDir = key === props.entryKey ? 'desc' : 'asc'
    const otherDir = sortDir === mainDir ? secDir : sortDir === secDir ? false : mainDir
    setSortKey(key)
    setSortDir(sortKey === key ? otherDir : mainDir)
  }

  return { entries, sortKey, sortDir, toggleSort }
}
