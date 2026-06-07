import { type ReactNode } from 'react'
import { DarkModeSvg, LightModeSvg } from '../../../src/assets/icons'
import { useThemeService } from '../../../src/services/theme-service'

interface Props {
  lightSlot: ReactNode
  darkSlot: ReactNode
  large?: boolean
}

export const DocsTokenGrid = ({ lightSlot, darkSlot, large }: Props) => {
  const { isUiDark } = useThemeService()

  return (
    <div
      className={cx(
        'gap-x-xs-0 pl-xs-2! p-xs-0 grid w-fit grid-cols-[auto_1fr] items-center rounded-sm',
        large ? 'gap-y-xs-4' : 'gap-y-xs-1',
        isUiDark ? 'bg-color-grey-18' : 'bg-color-grey-2',
      )}
    >
      <LightModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Light mode" />
      <div>{lightSlot}</div>

      <DarkModeSvg className="w-xs-7 mr-xs-1 text-color-text-subtle" aria-label="Dark mode" />
      <div>{darkSlot}</div>
    </div>
  )
}
