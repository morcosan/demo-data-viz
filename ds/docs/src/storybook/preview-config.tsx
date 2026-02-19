import { type HOC, HocComposer } from '@ds/core.ts'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { type ComponentType } from 'react'
import { fn } from 'storybook/test'
import { DocsCodeBlock } from '../components/docs-code-block.tsx'
import { DocsPage } from '../components/docs-page.tsx'
import { fixBrokenCSS } from './_preview-css-fix.ts'
import {
  computeServices,
  type DocsContainerProps,
  type GlobalConfig,
  type GlobalDefaults,
  type GlobalTypes,
  type PreviewDocs,
  type PreviewStory,
  type PreviewToolbar,
  type StoryContext,
} from './_preview-utils.tsx'

const toolbarConfig = {
  globalTypes: {
    colorTheme: {
      description: 'Change color theme',
      toolbar: {
        title: 'Light',
        icon: 'sun' as any,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' as any },
          { value: 'dark', title: 'Dark', icon: 'moon' as any },
        ],
      },
    },
    canvasBg: {
      description: 'Change canvas background',
      toolbar: {
        title: 'Grid',
        icon: 'photo' as any,
        items: [
          { value: 'grid', title: 'Grid', icon: 'photo' as any },
          { value: 'tiles', title: 'Tiles', icon: 'photo' as any },
          { value: 'blank', title: 'Blank', icon: 'photo' as any },
        ],
      },
    },
  },
  initialGlobals: {
    colorTheme: 'light',
    canvasBg: 'grid',
  },
} satisfies PreviewToolbar

const getStoryConfig = (providers: HOC[]) => {
  return {
    decorators: [
      (Story: ComponentType, { globals, tags, viewMode }: StoryContext) => (
        <HocComposer hocs={computeServices(providers, globals)}>
          {tags.includes('autodocs') || tags.includes('controls') ? (
            <DocsPage type={viewMode === 'docs' ? 'autodocs' : 'component'}>
              <Story />
            </DocsPage>
          ) : (
            <Story />
          )}
        </HocComposer>
      ),
    ],
  } satisfies PreviewStory
}

const getDocsConfig = (providers: HOC[]) => {
  return {
    components: {
      pre: (props: { className?: string; children: string | { props: ReactProps } }) => {
        let children, className

        if (typeof props.children === 'string') {
          children = props.children
          className = props.className
        } else {
          children = props.children?.props.children
          className = props.children?.props.className
        }

        return <DocsCodeBlock code={String(children)} language={className?.replace('language-', '') as any} />
      },
    },

    container: (props: DocsContainerProps) => {
      const isAutodocs = props.context.attachedCSFFiles?.size > 0

      fixBrokenCSS()

      return isAutodocs ? (
        <DocsContainer {...(props as any)} />
      ) : (
        <HocComposer hocs={computeServices(providers, props.context.store.userGlobals.globals)}>
          <DocsContainer {...(props as any)}>
            <DocsPage type="mdx">{props.children}</DocsPage>
          </DocsContainer>
        </HocComposer>
      )
    },
  } satisfies PreviewDocs
}

const mockNavigateFn = fn().mockName('navigate')
const mockNavigate = (...args: any[]) => {
  mockNavigateFn(...args)
  window.dispatchEvent(new CustomEvent('sb:navigate', { detail: args }))
}

const TRANSLATIONS: Record<string, string> = {
  'ds.action.close': 'Close',
}
const mockTranslate = (key: string) => TRANSLATIONS[key] || key

export { getDocsConfig, getStoryConfig, mockNavigate, mockTranslate, toolbarConfig }
export type { GlobalConfig, GlobalDefaults, GlobalTypes, StoryContext }
