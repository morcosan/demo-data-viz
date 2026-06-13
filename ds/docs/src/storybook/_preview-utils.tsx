import {
  A11yService,
  type ColorMode,
  ConfigService,
  type HOC,
  HocComposer,
  ThemeService,
  ViewportService,
} from '@ds/core'
import { type ComponentType, type ReactNode, StrictMode, useEffect } from 'react'
import { CrosshairService } from '../../../src/services/crosshair-service'
import { type DocsCanvasBg, DocsCanvasService } from '../services/docs-canvas-service'

interface GlobalConfig<T> {
  description: string
  toolbar: {
    items: Array<{ value: T; title: string; icon: string }>
  }
}
interface GlobalTypes {
  colorMode?: GlobalConfig<ColorMode>
  canvasBg?: GlobalConfig<DocsCanvasBg>
  hasCrosshair?: GlobalConfig<boolean>
}
interface GlobalDefaults {
  colorMode?: ColorMode | '_reset'
  canvasBg?: DocsCanvasBg | '_reset'
  hasCrosshair?: boolean
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
interface StoryContext<C = any, A = any> {
  globals: GlobalDefaults
  tags: string[]
  viewMode: 'docs' | 'story'
  args: C
  argTypes: Record<string, A>
  children?: ReactNode
  parameters: Record<string, any>
}
interface DocsContainerProps {
  children: ReactNode
  context: {
    attachedCSFFiles: Set<unknown>
    store: { userGlobals: { globals: GlobalDefaults } }
  }
}

interface DocsComponentProps {
  className?: string
  children: string | { props: ReactProps }
}

const computeServices = (providers: HOC[], globals: GlobalDefaults): HOC[] => {
  const colorMode = !globals.colorMode || globals.colorMode === '_reset' ? 'light' : globals.colorMode
  const canvasBg = !globals.canvasBg || globals.canvasBg === '_reset' ? 'grid' : globals.canvasBg
  const hasCrosshair = Boolean(globals.hasCrosshair === undefined || globals.hasCrosshair)
  const hoc = HocComposer.hoc
  return [
    hoc(StrictMode, {}),
    hoc(ConfigService, {}),
    hoc(A11yService, {}),
    hoc(ViewportService, {}),
    hoc(ThemeService, { cookieKeyMode: 'ds-color-mode', colorMode }),
    hoc(CrosshairService, { enabled: hasCrosshair }),
    hoc(DocsCanvasService, { canvasBg }),
    ...providers,
  ]
}

const usePageSurface = () => {
  useEffect(() => {
    const ids = ['#storybook-docs', '#storybook-root']
    ids.forEach((id) => document.querySelector(id)?.classList.add('ds-surface-page', 'bg-fixed'))
  }, [])
}

export { computeServices, usePageSurface }
export type {
  DocsComponentProps,
  DocsContainerProps,
  GlobalConfig,
  GlobalDefaults,
  GlobalTypes,
  PreviewDocs,
  PreviewStory,
  PreviewToolbar,
  StoryContext,
}
