'use client'

import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { useDefaults } from '../../utilities/react-utils'
import { useBaseButton } from '../_shared/use-base-button'
import { type ButtonProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { ButtonHighlight, ButtonProps, ButtonSize, ButtonVariant } from './_types'

/** Fundamental component for user actions and navigation */
export const Button = (rawProps: ButtonProps) => {
  const props = useDefaults<ButtonProps>(rawProps, {
    size: 'md',
    variant: 'solid-primary',
    highlight: 'default',
    linkType: 'internal',
  })
  const { $fontSize, $fontWeight, $radius, $spacing } = useThemeService()
  const { baseTokens, bindings, content, cssBaseButton, isVDefault, isVItem } = useBaseButton(props)

  const tokens = {
    ...baseTokens,
    paddingX: (() => {
      // Subtract border from padding
      if (isVItem) return `calc(${$spacing['button-px-item']} - 1px)`
      if (props.size === 'xs') return `calc(${$spacing['button-px-xs']} - 1px)`
      if (props.size === 'sm') return `calc(${$spacing['button-px-sm']} - 1px)`
      if (props.size === 'md') return `calc(${$spacing['button-px-md']} - 1px)`
      if (props.size === 'lg') return `calc(${$spacing['button-px-lg']} - 1px)`
    })(),
    borderRadius: props.size === 'lg' ? $radius['md'] : $radius['sm'],
    fontWeight: isVItem && isVDefault ? $fontWeight['sm'] : $fontWeight['md'],
    fontSize: (() => {
      if (isVItem) return 'unset'
      if (props.size === 'xs') return $fontSize['xs']
      if (props.size === 'sm') return $fontSize['sm']
      if (props.size === 'md') return $fontSize['md']
      if (props.size === 'lg') return $fontSize['lg']
    })(),
  }

  const cssButton: CSSObject = {
    ...cssBaseButton,
    minWidth: 'unset',
    padding: `0 ${tokens.paddingX}`,
    paddingTop: (() => {
      // The text inside doesn't look centered with the new font
      if (!isVItem) {
        if (props.size === 'xs') return '2px'
        if (props.size === 'sm') return '2px'
        if (props.size === 'md') return '2px'
        if (props.size === 'lg') return '2px'
      }
      return ''
    })(),
    borderRadius: tokens.borderRadius,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,

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
