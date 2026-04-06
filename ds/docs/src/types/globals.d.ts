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
      internal?: string[]
    }
  }

  interface WindowEventMap {
    'sb:navigate': CustomEvent
  }

  interface StoryShortcut {
    keys: string[]
    label: string
    fn: () => void
  }

  const ENV__BUILD_NUMBER: string
  const ENV__DS_VERSION: string
}
