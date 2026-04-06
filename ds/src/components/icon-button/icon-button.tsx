'use client'

import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { useBaseButton } from '../_shared/use-base-button'
import { type IconButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from './_types'

/** Fundamental component for user actions and navigation, displayed as icon */
export const IconButton = (props: IconButtonProps) => {
  const { linkHref, linkType = 'internal', pressed, size = 'md', variant = 'text-default' } = props
  const { $fontSize, $radius } = useThemeService()
  const highlight = pressed ? 'pressed' : 'default'
  const { baseTokens, bindings, content, cssBaseButton, isVText } = useBaseButton({
    ...props,
    highlight,
    linkType,
    size,
    variant,
  })

  const tokens = {
    ...baseTokens,
    borderRadius: isVText ? $radius['full'] : $radius['sm'],
  }

  const cssButton: CSSObject = {
    ...cssBaseButton,
    width: tokens.size,
    minWidth: tokens.size,
    padding: 0,
    borderRadius: tokens.borderRadius,
    fontSize: $fontSize['md'],

    '&::before, &::after': {
      ...(cssBaseButton['&::before, &::after'] as CSSObject),
      borderRadius: tokens.borderRadius,
    },
  }

  return linkHref ? (
    <a {...bindings} css={cssButton}>
      {content}
    </a>
  ) : (
    <button type="button" {...bindings} css={cssButton}>
      {content}
    </button>
  )
}
