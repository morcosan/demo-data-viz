import { HocComposer } from '@ds/core.ts'
import { DocsPage } from '../components/docs-page.tsx'
import { fixBrokenCSS } from './_preview-css-fix.ts'
import { computeServices } from './_preview-utils.tsx'

export const PreviewMdxPage = (props: ReactProps) => {
  fixBrokenCSS()

  return (
    <HocComposer hocs={computeServices([], {})}>
      <DocsPage type="mdx">{props.children}</DocsPage>
    </HocComposer>
  )
}
