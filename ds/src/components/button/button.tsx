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
  const { tokens } = useThemeService()
  const { baseCssVars, bindings, content, buttonBaseCss, isVDefault, isVItem } = useBaseButton({
    ...props,
    highlight,
    linkType,
    size,
    variant,
  })

  const cssVars = {
    ...baseCssVars,
    paddingX: (() => {
      // Subtract border from padding
      if (isVItem) return `calc(${tokens.spacing['button-px-item']} - 1px)`
      if (size === 'xs') return `calc(${tokens.spacing['button-px-xs']} - 1px)`
      if (size === 'sm') return `calc(${tokens.spacing['button-px-sm']} - 1px)`
      if (size === 'md') return `calc(${tokens.spacing['button-px-md']} - 1px)`
      if (size === 'lg') return `calc(${tokens.spacing['button-px-lg']} - 1px)`
    })(),
    borderRadius: size === 'lg' ? tokens.radius['md'] : tokens.radius['sm'],
    fontWeight: isVItem && isVDefault ? tokens.fontWeight['sm'] : tokens.fontWeight['md'],
    fontSize: (() => {
      if (isVItem) return 'unset'
      if (size === 'xs') return tokens.fontSize['xs']
      if (size === 'sm') return tokens.fontSize['sm']
      if (size === 'md') return tokens.fontSize['md']
      if (size === 'lg') return tokens.fontSize['lg']
    })(),
  }

  const buttonCss: CSSObject = {
    ...buttonBaseCss,
    minWidth: 'unset',
    padding: `0 ${cssVars.paddingX}`,
    borderRadius: cssVars.borderRadius,
    fontSize: cssVars.fontSize,
    fontWeight: cssVars.fontWeight,

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
