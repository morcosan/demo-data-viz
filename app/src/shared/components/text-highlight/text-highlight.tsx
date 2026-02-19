import { type CSSObject } from '@emotion/react'

interface Props extends ReactProps {
  text: string
  query: string
}

export const TextHighlight = ({ text, query, className }: Props) => {
  const normalizedQuery = query.toLowerCase()
  const queryForRegex = !query.trim() ? '(?!)' : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${queryForRegex}|\n)`, 'gi')
  const parts = text
    .split(regex)
    .filter((v: string) => v)
    .reduce((acc: string[], v: string) => (v === '\n' && acc[acc.length - 1] === '\n' ? acc : [...acc, v]), [])

  const cssMarks: CSSObject = {
    '& mark': {
      borderRadius: 'var(--ds-radius-xs)',
      backgroundColor: 'var(--ds-color-bg-highlight)',
      color: 'var(--ds-color-text-default)',
      padding: '0 1px',
    },
  }

  return (
    <span className={className} css={cssMarks}>
      {parts.map((part: string, index: number) =>
        part.toLowerCase() === normalizedQuery ? (
          <mark key={index}>{part}</mark>
        ) : part === '\n' ? (
          <br key={index} />
        ) : (
          part
        ),
      )}
    </span>
  )
}
