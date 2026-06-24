import { type CSSObject } from '@emotion/react'
import { useThemeService } from '../../services/theme-service'
import { type BaseButtonSize, type BaseButtonState, type BaseButtonVariant } from './types'

interface Props {
  state: BaseButtonState
  size: BaseButtonSize
  variant: BaseButtonVariant
}

export const useButtonStyles = ({ state, size, variant }: Props) => {
  const { tokens } = useThemeService()
  const isMenuItem = variant === 'menu-default' || variant === 'menu-caution'

  const height = (() => {
    if (size === 'xs') return tokens.spacing['button-h-xs']
    if (size === 'sm') return tokens.spacing['button-h-sm']
    if (size === 'md') return tokens.spacing['button-h-md']
    if (size === 'lg') return tokens.spacing['button-h-lg']
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
    if (state === 'selected') return tokens.surface['button-selection']
    if (variant === 'primary') return tokens.surface['button-primary']
    if (variant === 'secondary') return tokens.surface['button-secondary']
    if (variant === 'default') return tokens.surface['button-default']
    if (variant === 'optional') return tokens.surface['button-optional']
    if (variant === 'danger') return tokens.surface['button-danger']
    if (variant === 'caution') return tokens.surface['button-caution']
    if (variant === 'menu-default') return tokens.surface['button-default']
    if (variant === 'menu-caution') return tokens.surface['button-caution']
    return {}
  })()
  const surfaceHover = ((): CSSObject => {
    if (state === 'selected') return tokens.surface['button-selection-hover']
    if (variant === 'primary') return tokens.surface['button-primary-hover']
    if (variant === 'secondary') return tokens.surface['button-secondary-hover']
    if (variant === 'default') return tokens.surface['button-default-hover']
    if (variant === 'optional') return tokens.surface['button-optional-hover']
    if (variant === 'danger') return tokens.surface['button-danger-hover']
    if (variant === 'caution') return tokens.surface['button-caution-hover']
    if (variant === 'menu-default') return tokens.surface['button-default-hover']
    if (variant === 'menu-caution') return tokens.surface['button-caution-hover']
    return {}
  })()
  const surfacePress = ((): CSSObject => {
    if (state === 'selected') return tokens.surface['button-selection-press']
    if (variant === 'primary') return tokens.surface['button-primary-press']
    if (variant === 'secondary') return tokens.surface['button-secondary-press']
    if (variant === 'default') return tokens.surface['button-default-press']
    if (variant === 'optional') return tokens.surface['button-optional-press']
    if (variant === 'danger') return tokens.surface['button-danger-press']
    if (variant === 'caution') return tokens.surface['button-caution-press']
    if (variant === 'menu-default') return tokens.surface['button-default-press']
    if (variant === 'menu-caution') return tokens.surface['button-caution-press']
    return {}
  })()

  return {
    fontSize,
    fontWeight,
    height,
    paddingX,
    spinnerSize,
    surfaceDefault,
    surfaceHover,
    surfacePress,
  }
}
