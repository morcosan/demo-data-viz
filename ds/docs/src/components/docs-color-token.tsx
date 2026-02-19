interface Props {
  value: string
}

export const DocsColorToken = ({ value }: Props) => {
  const bgClass = cx(
    'h-sm-0 w-sm-0 border-color-border-default box-content overflow-hidden border',
    'docs-bg docs-bg-tiles',
  )

  return (
    <div className="gap-xs-3 flex items-center">
      <div className={bgClass}>
        <div className="h-full w-full" style={{ background: value }} />
      </div>
      <code>{value}</code>
    </div>
  )
}
