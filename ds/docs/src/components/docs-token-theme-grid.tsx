import { type ReactNode } from 'react'
import { DarkModeSvg, LightModeSvg } from '../../../src/assets/icons'

interface Props {
  lightSlot: ReactNode
  darkSlot: ReactNode
}

export const DocsTokenThemeGrid = ({ lightSlot, darkSlot }: Props) => {
  return (
    <div className="gap-xs-0 grid grid-cols-[auto_1fr] items-center">
      <LightModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Light mode" />
      <div>{lightSlot}</div>

      <DarkModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Dark mode" />
      <div>{darkSlot}</div>
    </div>
  )
}
