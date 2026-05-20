import { renderHtml } from '@ds/docs/core'
import changelogJson from '../../../changelog.json'
import packageJson from '../../../package.json'

interface ChangelogEntry {
  version: string
  date: string | null
  changes: {
    breaking?: string[]
    deprecated?: string[]
    tokens?: string[]
    components?: string[]
    services?: string[]
    utils?: string[]
    assets?: string[]
    docs?: string[]
    internal?: string[]
  }
}

export const Changelog = () => {
  const createList = (title: string, items: string[]) => (
    <>
      <p className="font-weight-md m-0!">{title}</p>
      <ul className="mt-0!">
        {items.map((item) => (
          <li key={item} dangerouslySetInnerHTML={{ __html: renderHtml(item) }} />
        ))}
      </ul>
    </>
  )

  return (
    <>
      {changelogJson.map((entry: ChangelogEntry) => (
        <div
          key={entry.version}
          className="bg-color-bg-card px-sm-0 py-xs-9 mt-sm-2 border-color-border-subtle relative rounded-lg border"
        >
          {packageJson.version === entry.version && (
            <div
              className={cx(
                '-top-xs-3 -left-xs-4 absolute',
                'px-xs-3 py-xs-0 border-color-border-subtle rounded-lg border',
                'text-size-xs bg-color-success-card-bg text-color-success-card-subtext font-weight-md',
              )}
            >
              Current
            </div>
          )}
          <h2 className="mt-0!">
            v{entry.version} <span className="ml-xs-2 text-size-xs font-weight-sm">/ {entry.date || 'Latest'}</span>
          </h2>
          <div className="gap-y-xs-3 gap-x-sm-0 grid grid-cols-1 md:grid-cols-[var(--ds-spacing-lg-0)_1fr]">
            {entry.changes.breaking?.length ? createList('💥 Breaking:', entry.changes.breaking) : ''}
            {entry.changes.deprecated?.length ? createList('💀 Deprecated:', entry.changes.deprecated) : ''}
            {entry.changes.tokens?.length ? createList('🎨 Design tokens:', entry.changes.tokens) : ''}
            {entry.changes.components?.length ? createList('🧩 Components:', entry.changes.components) : ''}
            {entry.changes.services?.length ? createList('⚙️ Services:', entry.changes.services) : ''}
            {entry.changes.utils?.length ? createList('🛠️ Utilities:', entry.changes.utils) : ''}
            {entry.changes.assets?.length ? createList('🖼️ Assets:', entry.changes.assets) : ''}
            {entry.changes.docs?.length ? createList('📚 Docs:', entry.changes.docs) : ''}
            {entry.changes.internal?.length ? createList('🔒 Internal:', entry.changes.internal) : ''}
          </div>
        </div>
      ))}
    </>
  )
}
