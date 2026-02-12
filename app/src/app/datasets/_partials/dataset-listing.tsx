'use client'

import { LayoutPane, LoadingSpinner } from '@app-components'
import { useVirtualScroll, type VirtualItem } from '@app-utils'
import { DatasetItem } from '@app/app/datasets/_partials/dataset-item.tsx'
import { SearchSvg, TextField, TOKENS__SPACING } from '@ds/core.ts'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Dataset } from '../_api/eurostat-api.ts'

interface Props extends ReactProps {
	datasets: Dataset[]
	loading: boolean
	onClickDataset?: () => void
}

export const DatasetListing = (props: Props) => {
	const { t } = useTranslation()
	const searchParams = useSearchParams()
	const codeParam = searchParams.get('code')
	const [keyword, setKeyword] = useState('')

	const datasets = useMemo(() => {
		if (!keyword.trim()) return props.datasets
		const word = keyword.trim().toLowerCase()
		return props.datasets.filter((dataset: Dataset) => dataset.title?.toLowerCase().includes(word))
	}, [props.datasets, keyword])

	const { vItems, vListHeight, vScrollerRef } = useVirtualScroll({
		count: datasets.length,
		itemSize: parseInt(TOKENS__SPACING['sm-9'].$value) + parseInt(TOKENS__SPACING['xs-1'].$value),
	})

	const handleSearchChange = (value: string) => setKeyword(value)

	return (
		<LayoutPane className={cx('flex flex-col', props.className)}>
			<div className="shadow-below-sm z-sticky p-scrollbar-w relative">
				<TextField
					value={keyword}
					disabled={props.loading}
					id="dataset-search"
					size="sm"
					placeholder={t('core.placeholder.search')}
					ariaLabel={t('dataViz.label.datasetSearch')}
					prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
					onChange={handleSearchChange}
				/>

				<div className="text-size-xs mt-xs-1 ml-xs-0 -mb-xs-1">
					{t('dataViz.label.datasetResults', { total: datasets.length.toLocaleString() })}
				</div>
			</div>

			{props.loading ? (
				<div className="flex-center flex h-full">
					<LoadingSpinner />
				</div>
			) : (
				<div ref={vScrollerRef} className="px-scrollbar-w py-a11y-scrollbar flex-1 overflow-y-auto">
					<ul className="-mb-xs-1 relative" style={{ height: vListHeight }}>
						{vItems.map((vItem: VirtualItem) => (
							<DatasetItem
								key={datasets[vItem.index].code}
								dataset={datasets[vItem.index]}
								keyword={keyword}
								selected={codeParam === datasets[vItem.index].code}
								className="absolute top-0 left-0 w-full"
								style={{ transform: `translateY(${vItem.start}px)` }}
								onClick={props.onClickDataset}
							/>
						))}
					</ul>
				</div>
			)}
		</LayoutPane>
	)
}
