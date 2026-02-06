'use client'

import type { Dataset } from '@app/app/datasets/_api/eurostat-api.ts'
import { LayoutPane } from '@app/components/layout-pane/layout-pane.tsx'
import { useSearchParams } from 'next/navigation'

interface Props extends ReactProps {
	datasets: Dataset[]
}

export const DatasetPreview = (props: Props) => {
	const searchParams = useSearchParams()
	const codeParam = searchParams.get('code')

	const dataset = props.datasets.find((dataset: Dataset) => dataset.code === codeParam)

	return (
		<LayoutPane className={cx('py-xs-5 px-xs-8', props.className)}>
			<h2 className="mb-sm-0 text-size-lg font-weight-md">{dataset?.title}</h2>
		</LayoutPane>
	)
}
