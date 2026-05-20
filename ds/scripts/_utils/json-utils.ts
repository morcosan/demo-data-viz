import type { SourceLocation } from 'estree'

const getLocFromPath = (documentNode: any, path: PropertyKey[]): SourceLocation | null => {
  let current: any = documentNode.body
  let parent: any = null

  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    const isLast = i === path.length - 1

    parent = current
    if (typeof key === 'symbol') return parent?.loc ?? null
    if (!current) return parent?.loc ?? null

    if (current.type === 'Array') {
      current = current.elements?.[key as number]?.value ?? null
    } else if (current.type === 'Object') {
      const member = current.members?.find((m: any) => m.name?.value === key)
      current = isLast ? (member?.name ?? null) : (member?.value ?? null)
    } else {
      return parent?.loc ?? null
    }
  }

  return current?.loc ?? parent?.loc ?? null
}

export { getLocFromPath }
