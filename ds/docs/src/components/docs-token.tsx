interface Props {
  value: string
  type?: 'color'
}

export const DocsToken = ({ value, type }: Props) => {
  const bgClass = cx(
    'h-xs-9 w-xs-9 border-color-border-default box-content overflow-hidden border',
    'docs-bg docs-bg-tiles',
  )

  return (
    <div className="gap-xs-0 flex items-center">
      {type === 'color' && (
        <div className={bgClass}>
          <div className="h-full w-full" style={{ background: value }} />
        </div>
      )}
      <code className="max-w-xl-1 overflow-auto">{value}</code>
    </div>
  )
}
