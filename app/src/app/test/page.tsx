import { Button } from '@ds/core.ts'
import type { Metadata } from 'next'
import { getServerT } from '../../i18n/i18n-server.ts'
import CloseSvg from './close.svg'

export const metadata: Metadata = {
	title: 'Test Page',
	description: 'Test Next.js here',
}

export default async function Page() {
	const t = await getServerT()

	return (
		<div className="p-sm-0 h-screen bg-white">
			<div className="flex">
				<CloseSvg /> {t('ds.action.close')}
			</div>

			{/*<Button />*/}
			<Button>DS button</Button>
		</div>
	)
}
