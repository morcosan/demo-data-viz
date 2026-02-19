'use client'

import { type CSSObject } from '@emotion/react'
import { Button as MantineButton } from '@mantine/core'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Loader.css'
import { useThemeService } from '../../services/theme-service'
import { useDefaults } from '../../utilities/react-utils'
import { useBaseButton } from '../_partials/use-base-button'
import { type ButtonProps } from './_types'

export type { LinkType } from '../_partials/types'
export type { ButtonHighlight, ButtonProps, ButtonSize, ButtonVariant } from './_types'

/** Fundamental component for user actions and navigation */
export const Button = (rawProps: ButtonProps) => {
  const props = useDefaults<ButtonProps>(rawProps, {
    size: 'md',
    variant: 'solid-primary',
    highlight: 'default',
    linkType: 'internal',
  })
  const { $fontSize, $fontWeight, $lineHeight, $radius, $spacing } = useThemeService()
  const { baseBindings, baseTokens, cssBaseButton, cssBaseChildren, isVDefault, isVItem, fixButtonAttrs } =
    useBaseButton(props)

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
    borderRadius: tokens.borderRadius,
    lineHeight: $lineHeight['sm'], // Needed for font descender
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,

    '&::before, &::after': {
      ...(cssBaseButton['&::before, &::after'] as CSSObject),
      borderRadius: tokens.borderRadius,
    },
  }

  const cssMantine: CSSObject = {
    ...cssButton,
    '--button-height': tokens.size,
    '--button-hover': tokens.bgColor,
    '--button-hover-color': tokens.textColor,
    '--button-color': tokens.textColor,
    overflow: 'unset',

    '&::before': {
      ...(cssButton['&::before'] as CSSObject),
      backgroundColor: 'unset',
      opacity: 'unset',
      transform: 'unset',
      filter: 'unset',
    },

    '&.mantine-active:active': {
      transform: tokens.pressTransform,
    },
    '.mantine-Button-loader': { lineHeight: 1 },
    '.mantine-Button-inner': { transform: 'unset' },
    '.mantine-Button-label': cssBaseChildren,
  }

  const bindings = {
    ...baseBindings,
    loading: props.loading,
    css: cssMantine,
    component: props.linkHref ? 'a' : undefined,
  }

  return (
    <MantineButton {...bindings} ref={fixButtonAttrs}>
      {props.children}
    </MantineButton>
  )
}
