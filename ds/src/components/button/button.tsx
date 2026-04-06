'use client'

import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { useBaseButton } from '../_shared/use-base-button'
import { type ButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { ButtonHighlight, ButtonProps, ButtonSize, ButtonVariant } from './_types'

/** Fundamental component for user actions and navigation */
export const Button = (props: ButtonProps) => {
  const { highlight = 'default', linkHref, linkType = 'internal', size = 'md', variant = 'solid-primary' } = props
  const { $fontSize, $fontWeight, $radius, $spacing } = useThemeService()
  const { baseTokens, bindings, content, cssBaseButton, isVDefault, isVItem } = useBaseButton({
    ...props,
    highlight,
    linkType,
    size,
    variant,
  })

  const tokens = {
    ...baseTokens,
    paddingX: (() => {
      // Subtract border from padding
      if (isVItem) return `calc(${$spacing['button-px-item']} - 1px)`
      if (size === 'xs') return `calc(${$spacing['button-px-xs']} - 1px)`
      if (size === 'sm') return `calc(${$spacing['button-px-sm']} - 1px)`
      if (size === 'md') return `calc(${$spacing['button-px-md']} - 1px)`
      if (size === 'lg') return `calc(${$spacing['button-px-lg']} - 1px)`
    })(),
    borderRadius: size === 'lg' ? $radius['md'] : $radius['sm'],
    fontWeight: isVItem && isVDefault ? $fontWeight['sm'] : $fontWeight['md'],
    fontSize: (() => {
      if (isVItem) return 'unset'
      if (size === 'xs') return $fontSize['xs']
      if (size === 'sm') return $fontSize['sm']
      if (size === 'md') return $fontSize['md']
      if (size === 'lg') return $fontSize['lg']
    })(),
  }

  const cssButton: CSSObject = {
    ...cssBaseButton,
    minWidth: 'unset',
    padding: `0 ${tokens.paddingX}`,
    borderRadius: tokens.borderRadius,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,

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
