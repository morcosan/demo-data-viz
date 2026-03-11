'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

interface Props {
  rowCount?: number
  colCount?: number
  itemHeight?: number | ((index: number) => number)
  itemWidth?: number | ((index: number) => number)
}

const useVirtualScroll = ({ rowCount, colCount, itemHeight, itemWidth }: Props) => {
  const vScrollerRef = useRef<HTMLDivElement>(null)

  const getScrollElement = () => vScrollerRef.current
  const estimateHeight = (index: number) => (typeof itemHeight === 'function' ? itemHeight(index) : itemHeight || 0)
  const estimateWidth = (index: number) => (typeof itemWidth === 'function' ? itemWidth(index) : itemWidth || 0)

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rowCount || 0,
    overscan: 5,
    estimateSize: estimateHeight,
    getScrollElement,
  })

  const colVirtualizer = useVirtualizer({
    horizontal: true,
    count: colCount || 0,
    overscan: 3,
    estimateSize: estimateWidth,
    getScrollElement,
  })

  const vTotalHeight = rowVirtualizer.getTotalSize()
  const vTotalWidth = colVirtualizer.getTotalSize()
  const vRowItems = rowVirtualizer.getVirtualItems()
  const vColItems = colVirtualizer.getVirtualItems()
  const vRowItemRef = rowVirtualizer.measureElement
  const vColItemRef = colVirtualizer.measureElement

  const vSpaceOnTop = vRowItems[0]?.start || 0
  const vSpaceOnBottom = vTotalHeight - (vRowItems[vRowItems.length - 1]?.end || 0)
  const vSpaceOnLeft = vColItems[0]?.start || 0
  const vSpaceOnRight = vTotalWidth - (vColItems[vColItems.length - 1]?.end || 0)

  useEffect(() => {
    if (!vScrollerRef.current) return

    const handleResize = debounce(() => colVirtualizer.measure(), 300)
    const observer = new ResizeObserver(handleResize)
    observer.observe(vScrollerRef.current)

    return () => {
      handleResize.cancel()
      observer.disconnect()
    }
  }, [colVirtualizer])

  return {
    vScrollerRef,
    vTotalHeight,
    vTotalWidth,
    vRowItems,
    vColItems,
    vRowItemRef,
    vColItemRef,
    vSpaceOnTop,
    vSpaceOnBottom,
    vSpaceOnLeft,
    vSpaceOnRight,
  }
}

export { type VirtualItem } from '@tanstack/virtual-core'
export { useVirtualScroll }
