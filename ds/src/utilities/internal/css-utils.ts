import { type CSSObject } from '@emotion/react'

export const CSS__ABSOLUTE_OVERLAY: CSSObject = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}
export const CSS__ABSOLUTE_CENTER: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}
export const CSS__FIXED_OVERLAY: CSSObject = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}
export const CSS__FIXED_CENTER: CSSObject = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}
export const CSS_A11Y_OUTLINE_PROXY: CSSObject = {
  '&:has(:focus), &:has(:focus-visible)': {
    outline: 'auto',
    outlineColor: '-webkit-focus-ring-color',
    outlineOffset: 'var(--ds-spacing-a11y-outline)',
  },
}
