'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Crosshair, type CrosshairRect } from './_partials/crosshair'

/**
 * Constants
 */
const TARGET_SELECTOR = 'button, [role="button"]'

/**
 * Context
 */
type Store = {
  enabled: boolean
  setEnabled(value: boolean): void
}
const Context = createContext<Store>({
  enabled: false,
  setEnabled: () => {},
})
const useCrosshairService = () => useContext(Context)

/**
 * Provider
 */
const CrosshairService = ({ children }: ReactProps) => {
  const [enabled, setEnabled] = useState(true)
  const [visible, setVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<CrosshairRect>({ top: 0, left: 0, width: 0, height: 0 })

  useEffect(() => {
    const registry = new Set<HTMLElement>()

    function updateRegistry(nodes: NodeList, action: 'add' | 'delete') {
      nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        if (node.matches(TARGET_SELECTOR)) registry[action](node)
        node.querySelectorAll<HTMLElement>(TARGET_SELECTOR).forEach((el) => registry[action](el))
      })
    }

    document.querySelectorAll<HTMLElement>(TARGET_SELECTOR).forEach((elem) => registry.add(elem))

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        updateRegistry(record.addedNodes, 'add')
        updateRegistry(record.removedNodes, 'delete')
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const getHoveredElement = (x: number, y: number): HTMLElement | null => {
      let bestElem: HTMLElement | null = null
      let bestArea = Infinity
      for (const elem of registry) {
        const rect = elem.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          const area = rect.width * rect.height
          if (area < bestArea) {
            bestElem = elem
            bestArea = area
          }
        }
      }
      return bestElem
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!enabled) return setVisible(false)

      const elem = getHoveredElement(event.clientX, event.clientY)
      if (!elem) return setVisible(false)

      const rect = elem.getBoundingClientRect()
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      setVisible(true)
    }

    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [enabled])

  const store: Store = useMemo(() => ({ enabled, setEnabled }), [enabled])

  return (
    <Context.Provider value={store}>
      {children}
      <Crosshair visible={visible && enabled} targetRect={targetRect} />
    </Context.Provider>
  )
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { CrosshairService, useCrosshairService }
