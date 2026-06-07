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
      <div>
        {Array.isArray(value) ? (
          <div className="gap-xs-0 flex flex-col">
            {value.map((entry) => (
              <code key={entry} className="max-w-lg-9 block overflow-auto">
                {entry}
              </code>
            ))}
          </div>
        ) : (
          <code className="max-w-lg-9 block overflow-auto">{value}</code>
        )}
      </div>
    </div>
  )
}
