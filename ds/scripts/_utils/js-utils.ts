import type { Node, SourceLocation } from 'estree'

const getLocFromPath = (programNode: Node, path: PropertyKey[]): SourceLocation | null => {
  let current: any = (programNode as any).body?.[0]?.expression ?? (programNode as any).body?.[0]
  let parent: any = null

  for (const key of path) {
    parent = current
    if (typeof key === 'symbol') return parent?.loc ?? null
    if (!current) return parent?.loc ?? null
    if (current.type === 'ArrayExpression') {
      current = current.elements?.[key as number] ?? null
    } else if (current.type === 'ObjectExpression') {
      const prop = current.properties?.find((p: any) => p.key?.value === key || p.key?.name === key)
      current = prop?.value ?? prop?.key ?? null
    } else {
      return parent?.loc ?? null
    }
  }

  return current?.loc ?? parent?.loc ?? null
}

export { getLocFromPath }
