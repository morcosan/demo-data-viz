'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Crosshair, type CrosshairProps } from './_partials/crosshair'

/**
 * Constants
 */
const TARGET_SELECTOR = 'button, [role="button"]'

/**
 * Registry
 */
const registry = new Set<HTMLElement>()

function syncNodes(nodes: NodeList, action: 'add' | 'delete') {
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    if (node.matches(TARGET_SELECTOR)) registry[action](node)
    node.querySelectorAll<HTMLElement>(TARGET_SELECTOR).forEach((el) => registry[action](el))
  })
}

function hitTest(x: number, y: number): HTMLElement | null {
  let best: HTMLElement | null = null
  let bestArea = Infinity
  for (const el of registry) {
    const r = el.getBoundingClientRect()
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      const area = r.width * r.height
      if (area < bestArea) {
        best = el
        bestArea = area
      }
    }
  }
  return best
}

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

const HIDDEN: CrosshairProps = { visible: false, top: 0, left: 0, width: 0, height: 0, square: false }

/**
 * Provider
 */
const CrosshairService = ({ children }: ReactProps) => {
  const [enabled, setEnabled] = useState(true)
  const [crosshairProps, setCrosshairProps] = useState<CrosshairProps>(HIDDEN)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(TARGET_SELECTOR).forEach((el) => registry.add(el))

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        syncNodes(record.addedNodes, 'add')
        syncNodes(record.removedNodes, 'delete')
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const onMove = (event: MouseEvent) => {
      if (!enabledRef.current) {
        setCrosshairProps(HIDDEN)
        return
      }

      const elem = hitTest(event.clientX, event.clientY)
      if (!elem) {
        setCrosshairProps((prev) => (prev.visible ? HIDDEN : prev))
        return
      }

      const rect = elem.getBoundingClientRect()
      const isSquare = Math.abs(rect.width - rect.height) < 4

      setCrosshairProps((prev) => {
        const isSame =
          prev.visible &&
          prev.top === rect.top &&
          prev.left === rect.left &&
          prev.width === rect.width &&
          prev.height === rect.height &&
          prev.square === isSquare

        return isSame
          ? prev
          : { visible: true, top: rect.top, left: rect.left, width: rect.width, height: rect.height, square: isSquare }
      })
    }

    document.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      observer.disconnect()
      document.removeEventListener('mousemove', onMove)
      registry.clear()
    }
  }, [])

  const store: Store = useMemo(() => ({ enabled, setEnabled }), [enabled])

  return (
    <Context.Provider value={store}>
      {children}
      {enabled && <Crosshair {...crosshairProps} />}
    </Context.Provider>
  )
}

/**
 * Export
 */
/* eslint-disable react-refresh/only-export-components */
export { CrosshairService, useCrosshairService }
