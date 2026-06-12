import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { type BaseButtonSize, type BaseVariant } from './types'

interface Props {
  size: BaseButtonSize
  variant: BaseVariant
}

export const useButtonStyles = ({ size, variant }: Props) => {
  const { tokens } = useThemeService()
  const isMenuItem = variant === 'menu-default' || variant === 'menu-caution'

  const height = (() => {
    if (size === 'xs') return tokens.spacing['button-h-xs']
    if (size === 'sm') return tokens.spacing['button-h-sm']
    if (size === 'md') return tokens.spacing['button-h-md']
    if (size === 'lg') return tokens.spacing['button-h-lg']
    return ''
  })()
  const crosshairSize = (() => {
    if (size === 'xs') return '2px'
    if (size === 'sm') return '2px'
    if (size === 'md') return '3px'
    if (size === 'lg') return '3px'
    return ''
  })()
  const paddingX = (() => {
    // Subtract border from padding
    if (isMenuItem) return `calc(${tokens.spacing['button-px-item']} - 1px)`
    if (size === 'xs') return `calc(${tokens.spacing['button-px-xs']} - 1px)`
    if (size === 'sm') return `calc(${tokens.spacing['button-px-sm']} - 1px)`
    if (size === 'md') return `calc(${tokens.spacing['button-px-md']} - 1px)`
    if (size === 'lg') return `calc(${tokens.spacing['button-px-lg']} - 1px)`
  })()
  const scalePressed = (() => {
    if (size === 'xs') return '0.88'
    if (size === 'sm') return '0.9'
    if (size === 'md') return '0.92'
    if (size === 'lg') return '0.92'
    return ''
  })()
  const spinnerSize = (() => {
    if (size === 'xs') return tokens.spacing['xs-5']
    if (size === 'sm') return tokens.spacing['xs-7']
    if (size === 'md') return tokens.spacing['xs-9']
    if (size === 'lg') return tokens.spacing['sm-0']
    return ''
  })()
  const fontSize = (() => {
    if (isMenuItem) return 'unset'
    if (size === 'xs') return tokens.fontSize['xs']
    if (size === 'sm') return tokens.fontSize['sm']
    if (size === 'md') return tokens.fontSize['md']
    if (size === 'lg') return tokens.fontSize['lg']
  })()
  const fontWeight = isMenuItem ? tokens.fontWeight['sm'] : tokens.fontWeight['md']

  const surfaceDefault = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary']
    if (variant === 'secondary') return tokens.surface['button-secondary']
    if (variant === 'tertiary') return tokens.surface['button-tertiary']
    if (variant === 'optional') return tokens.surface['button-optional']
    if (variant === 'danger') return tokens.surface['button-danger']
    if (variant === 'caution') return tokens.surface['button-caution']
    if (variant === 'menu-default') return tokens.surface['button-tertiary']
    if (variant === 'menu-caution') return tokens.surface['button-caution']
    return {}
  })()
  const surfaceHovered = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-hovered']
    if (variant === 'secondary') return tokens.surface['button-secondary-hovered']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-hovered']
    if (variant === 'optional') return tokens.surface['button-optional-hovered']
    if (variant === 'danger') return tokens.surface['button-danger-hovered']
    if (variant === 'caution') return tokens.surface['button-caution-hovered']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-hovered']
    if (variant === 'menu-caution') return tokens.surface['button-caution-hovered']
    return {}
  })()
  const surfacePressed = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-pressed']
    if (variant === 'secondary') return tokens.surface['button-secondary-pressed']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-pressed']
    if (variant === 'optional') return tokens.surface['button-optional-pressed']
    if (variant === 'danger') return tokens.surface['button-danger-pressed']
    if (variant === 'caution') return tokens.surface['button-caution-pressed']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-pressed']
    if (variant === 'menu-caution') return tokens.surface['button-caution-pressed']
    return {}
  })()
  const surfaceSelected = ((): CSSObject => {
    if (variant === 'primary') return tokens.surface['button-primary-selected']
    if (variant === 'secondary') return tokens.surface['button-secondary-selected']
    if (variant === 'tertiary') return tokens.surface['button-tertiary-selected']
    if (variant === 'optional') return tokens.surface['button-optional-selected']
    if (variant === 'danger') return tokens.surface['button-danger-selected']
    if (variant === 'caution') return tokens.surface['button-caution-selected']
    if (variant === 'menu-default') return tokens.surface['button-tertiary-selected']
    if (variant === 'menu-caution') return tokens.surface['button-caution-selected']
    return {}
  })()

  return {
    crosshairSize,
    fontSize,
    fontWeight,
    height,
    paddingX,
    scalePressed,
    spinnerSize,
    surfaceDefault,
    surfaceHovered,
    surfacePressed,
    surfaceSelected,
  }
}
