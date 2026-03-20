'use client'

import { type ReactNode, type Ref, type RefObject, useImperativeHandle, useMemo } from 'react'

interface HOC<C = any> {
  comp: C
  props: JsxProps<C>
}
interface Props extends ReactProps {
  hocs: HOC[]
}

const HocComposer = ({ children, hocs }: Props) => {
  return hocs.reduceRight((acc: ReactNode, hoc: HOC) => <hoc.comp {...(hoc.props || {})}>{acc}</hoc.comp>, children)
}
HocComposer.hoc = <C,>(comp: C, props: JsxProps<C>): HOC<C> => ({ comp, props })

const useDefaults = <P extends Record<string, any>>(rawProps: P, defaults: Partial<P>, truthy?: boolean): P => {
  return useMemo(() => {
    const props = { ...defaults } as any

    Object.entries(rawProps).forEach(([key, value]) => {
      const isValid = truthy ? Boolean(value) : value !== undefined
      if (isValid) {
        props[key] = value
      }
    })

    return props
  }, [rawProps, defaults, truthy])
}

type NodeRef = RefObject<HTMLElement | null>

const useRefHandle = <T,>(ref: Ref<T> | undefined, nodeRef: NodeRef, handle: Partial<T>, deps?: unknown[]) => {
  useImperativeHandle(
    ref,
    () => {
      if (!nodeRef.current) return null as unknown as T
      Object.defineProperties(
        nodeRef.current,
        Object.fromEntries(
          Object.entries(handle).map(([key, value]) => [key, { value, configurable: true, writable: true }]),
        ),
      )
      return nodeRef.current as T
    },
    deps || [],
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { HocComposer, useDefaults, useRefHandle, type HOC }
