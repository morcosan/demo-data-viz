import { type ReactNode } from 'react'
import { DocsCanvas } from './docs-canvas.tsx'

interface Props extends ReactProps {
  title?: string | ReactNode
  type?: 'default' | 'component' | 'autodocs' | 'mdx'
}

export const DocsPage = ({ title, type, children }: Props) => {
  if (type === 'autodocs') {
    return <DocsCanvas className="flex-center min-h-lg-7 relative flex-col">{children}</DocsCanvas>
  }
  if (type === 'component') {
    return (
      <div className="px-sm-0 py-sm-2 flex min-h-screen flex-col">
        <DocsCanvas className="flex-1" extended>
          {children}
        </DocsCanvas>
      </div>
    )
  }
  if (type === 'mdx') {
    return <div className="docs-mdx pb-md-0">{children}</div>
  }
  return (
    <div className="px-sm-3 py-sm-2 mb-md-0">
      {title && <h1 className="mb-sm-2 text-size-xxl font-weight-lg">{title}</h1>}
      {children}
    </div>
  )
}
