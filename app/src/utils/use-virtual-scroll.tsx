import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export { type VirtualItem } from '@tanstack/virtual-core'

interface Props {
	count: number
	itemSize: number
}

export const useVirtualScroll = (props: Props) => {
	const vScrollerRef = useRef<HTMLDivElement>(null)

	const getScrollElement = () => vScrollerRef.current
	const estimateSize = () => props.itemSize

	// eslint-disable-next-line react-hooks/incompatible-library
	const { getTotalSize, getVirtualItems } = useVirtualizer({
		count: props.count,
		overscan: 5,
		getScrollElement,
		estimateSize,
	})

	return {
		vScrollerRef,
		vListHeight: `${getTotalSize()}px`,
		vItems: getVirtualItems(),
	}
}
