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
  const { tokens } = useThemeService()
  const highlight = pressed ? 'pressed' : 'default'
  const { baseCssVars, bindings, content, buttonBaseCss, isVText } = useBaseButton({
    ...props,
    highlight,
    linkType,
    size,
    variant,
  })

  const cssVars = {
    ...baseCssVars,
    borderRadius: isVText ? tokens.radius['full'] : tokens.radius['sm'],
  }

  const buttonCss: CSSObject = {
    ...buttonBaseCss,
    width: cssVars.size,
    minWidth: cssVars.size,
    padding: 0,
    borderRadius: cssVars.borderRadius,
    fontSize: tokens.fontSize['md'],

    '&::before, &::after': {
      ...(buttonBaseCss['&::before, &::after'] as CSSObject),
      borderRadius: cssVars.borderRadius,
    },
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
