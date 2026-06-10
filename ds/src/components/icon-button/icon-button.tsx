'use client'

import { type CSSObject } from '@emotion/react'
import { useButtonBase } from '../_shared/use-button-base'
import { type IconButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from './_types'

/** Fundamental component for user actions and navigation, displayed as icon */
export const IconButton = (props: IconButtonProps) => {
  const { linkHref, linkType = 'internal', size = 'md', variant = 'primary', state = 'default' } = props
  const { bindings, buttonCss, content, height } = useButtonBase({
    ...{ ...props, linkType, size, state, variant, isIcon: true },
  })

  const rootCss: CSSObject = {
    ...buttonCss,
    width: height,
    minWidth: height,
  }

  return linkHref ? (
    <a {...bindings} css={rootCss}>
      {content}
    </a>
  ) : (
    <button type="button" {...bindings} css={rootCss}>
      {content}
    </button>
  )
}
