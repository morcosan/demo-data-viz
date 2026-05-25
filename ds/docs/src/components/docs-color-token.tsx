interface Props {
  value: string
}

export const DocsColorToken = ({ value }: Props) => {
  const bgClass = cx(
    'h-xs-9 w-xs-9 border-color-border-default box-content overflow-hidden border',
    'docs-bg docs-bg-tiles',
  )

  return (
    <div className="gap-xs-0 flex items-center">
      <div className={bgClass}>
        <div className="h-full w-full" style={{ background: value }} />
      </div>
      <code>{value}</code>
    </div>
  )
}
