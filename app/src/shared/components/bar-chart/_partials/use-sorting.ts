import { useEffect, useMemo, useState } from 'react'
import { type BarChartProps } from '../_types'

interface Props extends BarChartProps {
  barKeys: string[]
}

export const useSorting = (props: Props) => {
  const [sortKey, setSortKey] = useState<string | null>(props.sortKey || null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | false>(props.sortDir || false)

  const entries = useMemo(() => {
    const filtered = props.data.entries.filter((entry) => props.barKeys.some((key) => typeof entry[key] === 'number'))

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
  }, [props.data.entries, props.barKeys, sortKey, sortDir])

  const toggleSort = (key: string) => {
    const mainDir = key === props.entryKey ? 'asc' : 'desc'
    const secDir = key === props.entryKey ? 'desc' : 'asc'
    const otherDir = sortDir === mainDir ? secDir : sortDir === secDir ? false : mainDir
    setSortKey(key)
    setSortDir(sortKey === key ? otherDir : mainDir)
  }

  useEffect(() => {
    setSortKey(props.sortKey || null)
    setSortDir(props.sortDir || false)
  }, [props.sortKey, props.sortDir])

  return { entries, sortKey, sortDir, toggleSort }
}
