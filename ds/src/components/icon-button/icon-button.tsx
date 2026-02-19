'use client'

import { type CSSObject } from '@emotion/react'
import { Button as MantineButton } from '@mantine/core'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Loader.css'
import { useThemeService } from '../../services/theme-service'
import { useDefaults } from '../../utilities/react-utils'
import { useBaseButton } from '../_partials/use-base-button'
import { type IconButtonProps } from './_types'

export type { LinkType } from '../_partials/types'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from './_types'

/** Fundamental component for user actions and navigation, displayed as icon */
export const IconButton = (rawProps: IconButtonProps) => {
  const props = useDefaults<IconButtonProps>(rawProps, {
    size: 'md',
    variant: 'text-default',
    linkType: 'internal',
  })
  const { $fontSize, $radius } = useThemeService()
  const { baseBindings, baseTokens, cssBaseButton, cssBaseChildren, isVText, fixButtonAttrs } = useBaseButton({
    ...props,
    highlight: props.pressed ? 'pressed' : 'default',
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

  const cssMantine: CSSObject = {
    ...cssButton,
    '--button-height': `calc(${tokens.size} * 0.8)`,
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
