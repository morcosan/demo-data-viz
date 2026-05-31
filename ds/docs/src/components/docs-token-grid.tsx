import { type ReactNode } from 'react'
import { DarkModeSvg, LightModeSvg } from '../../../src/assets/icons'

interface Props {
  lightSlot: ReactNode
  darkSlot: ReactNode
  large?: boolean
}

export const DocsTokenGrid = ({ lightSlot, darkSlot, large }: Props) => {
  return (
    <div className={cx('gap-x-xs-0 grid grid-cols-[auto_1fr] items-center', large ? 'gap-y-xs-4' : 'gap-y-xs-1')}>
      <LightModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Light mode" />
      <div>{lightSlot}</div>

      <DarkModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Dark mode" />
      <div>{darkSlot}</div>
    </div>
  )
}
