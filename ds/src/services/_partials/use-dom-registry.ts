import { useEffect, useRef } from 'react'

const useDomRegistry = (selector: string) => {
  const registryRef = useRef<Set<HTMLElement>>(new Set())

  useEffect(() => {
    const registry = registryRef.current

    function updateRegistry(nodes: NodeList, action: 'add' | 'delete') {
      nodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return
        if (node.matches(selector)) registry[action](node)
        node.querySelectorAll<HTMLElement>(selector).forEach((el) => registry[action](el))
      })
    }

    document.querySelectorAll<HTMLElement>(selector).forEach((elem) => registry.add(elem))

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        updateRegistry(record.addedNodes, 'add')
        updateRegistry(record.removedNodes, 'delete')
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      registry.clear()
    }
  }, [selector])

  return registryRef
}

export { useDomRegistry }
