import { HocComposer } from '@ds/core'
import { DocsPage } from '../components/docs-page'
import { fixBrokenCSS } from './_preview-css-fix'
import { computeServices } from './_preview-utils'

export const PreviewMdxPage = (props: ReactProps) => {
  fixBrokenCSS()

  return (
    <HocComposer hocs={computeServices([], {})}>
      <DocsPage type="mdx">{props.children}</DocsPage>
    </HocComposer>
  )
}
