export {}
declare global {
  interface ChangelogItem {
    version: string
    date: string | null
    changes: {
      breaking?: string[]
      deprecated?: string[]
      tokens?: string[]
      components?: string[]
      services?: string[]
      utils?: string[]
      assets?: string[]
      docs?: string[]
    }
  }

  interface WindowEventMap {
    'sb:navigate': CustomEvent
  }

  const ENV__BUILD_NUMBER: string
  const ENV__DS_VERSION: string
}
