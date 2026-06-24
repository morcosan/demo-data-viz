'use client'

import { type CSSObject } from '@emotion/react'
import { Loader } from '@mantine/core'
import { useThemeService } from '../../services/theme-service'
import { useDataProps } from '../../utilities/react-utils'
import { useHoverEffect } from '../../utilities/use-hover-effect'
import { type BaseButtonState } from '../_shared/types'
import { useClickable } from '../_shared/use-clickable'
import { type CardProps } from './_types'

export type { LinkType } from '../_shared/types'
export type { CardProps, CardState } from './_types'

/** Flexible component for UI display, user actions, or navigation */
export const Card = (props: CardProps) => {
  const {
    ariaDescription,
    children,
    className,
    style,
    tooltip,
    linkHref,
    linkType = 'internal',
    state = 'static',
    size = 'md',
  } = props
  const { tokens } = useThemeService()
  const buttonState: BaseButtonState = state === 'static' ? 'disabled' : state
  const { bindings, isNoop, isPressed, pressing } = useClickable({ ...props, linkType, state: buttonState })
  const dataProps = useDataProps(props)
  const hoverEffect = useHoverEffect({ square: true })
  const isStatic = state === 'static'

  const spinnerCss: CSSObject = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
  }
  const spinnerIconCss: CSSObject = {
    '--loader-size': `${tokens.spacing['sm-0']} !important`,
    '--loader-color': `${tokens.color['text-subtle']} !important`,
  }

  const surfaceDefault = state === 'selected' ? tokens.surface['card-selection'] : tokens.surface['card']
  const surfaceHover = state === 'selected' ? tokens.surface['card-selection-hover'] : tokens.surface['card-hover']
  const surfacePress = state === 'selected' ? tokens.surface['card-selection-press'] : tokens.surface['card-press']
  const surfaceCss: CSSObject = {
    ...(isPressed ? surfacePress : surfaceDefault),
    display: 'grid',
    width: '100%',
    height: '100%',
    padding: (() => {
      if (size === 'sm') return `${tokens.spacing['card-py-sm']} ${tokens.spacing['card-px-sm']}`
      if (size === 'md') return `${tokens.spacing['card-py-md']} ${tokens.spacing['card-px-md']}`
      if (size === 'lg') return `${tokens.spacing['card-py-lg']} ${tokens.spacing['card-px-lg']}`
      if (size === 'xl') return `${tokens.spacing['card-py-xl']} ${tokens.spacing['card-px-xl']}`
      return ''
    })(),
    transition: ['all 0.2s ease', 'background-size 0s step-start', 'background-position 0s step-start'].join(','),
    pointerEvents: 'none',
    '&::before': {
      position: 'absolute',
      inset: '-1px',
      content: '""',
      border: `1px solid ${tokens.color['border-inset']}`,
      borderRadius: surfaceDefault.borderRadius,
      opacity: isPressed ? 1 : 0,
      transition: 'all 0.2s ease',
    },
  }
  const childrenCss: CSSObject = {
    display: 'flex',
    width: '100%',
    height: '100%',
    opacity: state === 'loading' ? 0 : 1,
    fill: 'currentColor',
    stroke: 'currentColor',
    textAlign: 'left',
  }
  const cardCss: CSSObject = {
    position: 'relative',
    display: 'grid',
    minWidth: tokens.spacing['button-h-lg'],
    minHeight: tokens.spacing['button-h-lg'],
    borderRadius: surfaceCss.borderRadius,
    outlineOffset: `calc(1px + ${tokens.spacing['a11y-outline']})`, // CSS bug: outline offset overlaps border width
    opacity: isStatic ? 'unset' : isNoop ? 0.4 : 1,
    cursor: isStatic ? 'unset' : isNoop ? 'not-allowed' : 'pointer',
    '&:hover, &:focus': isNoop
      ? {}
      : pressing
        ? { '& > span:nth-of-type(1)': hoverEffect.css }
        : {
            '& > span:nth-of-type(1)': hoverEffect.css,
            '& > span:nth-of-type(2)': surfaceHover,
          },
  }
  const cardBindings = {
    ...bindings,
    title: tooltip,
    className: className,
    style: style,
    css: cardCss,
    'aria-description': ariaDescription,
    ...dataProps,
  }

  const content = (
    <>
      {hoverEffect.html}
      <span css={surfaceCss}>
        <span css={childrenCss}>{children}</span>
        {state === 'loading' && (
          <span css={spinnerCss}>
            <Loader css={spinnerIconCss} />
          </span>
        )}
      </span>
    </>
  )

  return isStatic ? (
    <div {...cardBindings} css={cardCss}>
      {content}
    </div>
  ) : linkHref ? (
    <a {...cardBindings} css={cardCss}>
      {content}
    </a>
  ) : (
    <button type="button" {...cardBindings} css={cardCss}>
      {content}
    </button>
  )
}
