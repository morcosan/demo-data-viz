import {
  A11yService,
  type ColorTheme,
  ConfigService,
  type HOC,
  HocComposer,
  ThemeService,
  ViewportService,
} from '@ds/core'
import { type ComponentType, type ReactNode, StrictMode } from 'react'
import { type DocsCanvasBg, DocsCanvasService } from '../services/docs-canvas-service'

interface GlobalConfig<T> {
  description: string
  toolbar: {
    title: string
    icon: string
    items: Array<{ value: T; title: string; icon: string }>
  }
}
interface GlobalTypes {
  colorTheme?: GlobalConfig<ColorTheme>
  canvasBg?: GlobalConfig<DocsCanvasBg>
}
interface GlobalDefaults {
  colorTheme?: ColorTheme | '_reset'
  canvasBg?: DocsCanvasBg | '_reset'
}
interface PreviewToolbar {
  globalTypes: GlobalTypes
  initialGlobals: GlobalDefaults
}
interface PreviewStory {
  decorators: Array<(Story: ComponentType, ctx: StoryContext) => ReactNode>
}
interface PreviewDocs {
  components: {
    [key: string]: JsxFn<any>
  }
  container: ({ children, context }: DocsContainerProps) => ReactNode
}
interface StoryContext<C = any> {
  globals: GlobalDefaults
  tags: string[]
  viewMode: 'docs' | 'story'
  args: C
  children?: ReactNode
}
interface DocsContainerProps {
  children: ReactNode
  context: {
    attachedCSFFiles: Set<unknown>
    store: { userGlobals: { globals: GlobalDefaults } }
  }
}

const computeServices = (providers: HOC[], globals: GlobalDefaults): HOC[] => {
  const colorTheme = !globals.colorTheme || globals.colorTheme === '_reset' ? 'light' : globals.colorTheme
  const canvasBg = !globals.canvasBg || globals.canvasBg === '_reset' ? 'grid' : globals.canvasBg
  const hoc = HocComposer.hoc
  return [
    hoc(StrictMode, {}),
    hoc(ConfigService, {}),
    hoc(A11yService, {}),
    hoc(ViewportService, {}),
    hoc(ThemeService, { cookieKey: 'ds-color-theme', colorTheme }),
    hoc(DocsCanvasService, { canvasBg }),
    ...providers,
  ]
}

export { computeServices }
export type {
  DocsContainerProps,
  GlobalConfig,
  GlobalDefaults,
  GlobalTypes,
  PreviewDocs,
  PreviewStory,
  PreviewToolbar,
  StoryContext,
}
