import '@ds/types.d.ts'

export {}
declare global {
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
