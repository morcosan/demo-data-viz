'use client'

import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { useBaseButton } from '../_shared/use-base-button'
import { type IconButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from './_types'

/** Fundamental component for user actions and navigation, displayed as icon */
export const IconButton = (props: IconButtonProps) => {
  const { linkHref, linkType = 'internal', size = 'md', variant = 'primary', state = 'default' } = props
  const { tokens } = useThemeService()
  const { bindings, buttonBaseCss, content, height } = useBaseButton({
    ...props,
    linkType,
    size,
    state,
    variant,
  })

  const buttonCss: CSSObject = {
    ...buttonBaseCss,
    width: height,
    minWidth: height,
    padding: 0,
    borderRadius: tokens.radius['full'],
    fontSize: tokens.fontSize['md'],
  }

  return linkHref ? (
    <a {...bindings} css={buttonCss}>
      {content}
    </a>
  ) : (
    <button type="button" {...bindings} css={buttonCss}>
      {content}
    </button>
  )
}
