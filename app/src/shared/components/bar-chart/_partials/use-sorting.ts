import { useEffect, useMemo, useState } from 'react'
import { type BarChartProps } from '../_types'

interface Props extends BarChartProps {
  barKeys: string[]
}

export const useSorting = (props: Props) => {
  const { data, barKeys, entryKey, sortKey: sortKeyProp, sortDir: sortDirProp } = props
  const [sortKey, setSortKey] = useState<string | null>(sortKeyProp || null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | false>(sortDirProp || false)

  const entries = useMemo(() => {
    const filtered = data.entries.filter((entry) => barKeys.some((key) => typeof entry[key] === 'number'))

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
  }, [data.entries, barKeys, sortKey, sortDir])

  const toggleSort = (key: string) => {
    const mainDir = key === entryKey ? 'asc' : 'desc'
    const secDir = key === entryKey ? 'desc' : 'asc'
    const otherDir = sortDir === mainDir ? secDir : sortDir === secDir ? false : mainDir
    setSortKey(key)
    setSortDir(sortKey === key ? otherDir : mainDir)
  }

  useEffect(() => {
    setSortKey(sortKeyProp || null)
    setSortDir(sortDirProp || false)
  }, [sortKeyProp, sortDirProp])

  return { entries, sortKey, sortDir, toggleSort }
}
