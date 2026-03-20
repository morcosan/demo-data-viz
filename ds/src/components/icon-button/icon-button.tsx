'use client'

import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { useDefaults } from '../../utilities/react-utils'
import { useBaseButton } from '../_shared/use-base-button'
import { type IconButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from './_types'

/** Fundamental component for user actions and navigation, displayed as icon */
export const IconButton = (rawProps: IconButtonProps) => {
  const props = useDefaults<IconButtonProps>(rawProps, {
    size: 'md',
    variant: 'text-default',
    linkType: 'internal',
  })
  const { $fontSize, $radius } = useThemeService()
  const highlight = props.pressed ? 'pressed' : 'default'
  const { baseTokens, bindings, content, cssBaseButton, isVText } = useBaseButton({ ...props, highlight })

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

  return props.linkHref ? (
    <a {...bindings} css={cssButton}>
      {content}
    </a>
  ) : (
    <button type="button" {...bindings} css={cssButton}>
      {content}
    </button>
  )
}
