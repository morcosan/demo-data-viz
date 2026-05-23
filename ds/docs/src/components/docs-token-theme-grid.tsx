import { type ReactNode } from 'react'

interface Props {
  lightSlot: ReactNode
  darkSlot: ReactNode
  noLabel?: boolean
}

export const DocsTokenThemeGrid = ({ lightSlot, darkSlot, noLabel }: Props) => {
  return (
    <div className={cx(noLabel ? '' : 'grid grid-cols-[45px_auto] items-center')}>
      {!noLabel && <div className="text-size-sm font-weight-lg">Light:</div>}
      <div>{lightSlot}</div>

      {!noLabel && <div className="text-size-sm font-weight-lg">Dark:</div>}
      <div>{darkSlot}</div>
    </div>
  )
}
