'use client'

import { useTranslation } from '@app-i18n'
import { useDefaults } from '@ds/core.ts'
import { Loader } from '@mantine/core'

interface Props extends ReactProps {
	size?: 'xs' | 'sm'
}

export const LoadingSpinner = (rawProps: Props) => {
	const { t } = useTranslation()
	const props = useDefaults(rawProps, { size: 'sm' })

	return (
		<div
			className={cx('flex items-center', props.size === 'xs' ? 'text-size-sm gap-xs-3' : 'text-size-md gap-xs-4')}
		>
			<Loader color="gray" size={props.size} />
			{t('core.status.loading')}
		</div>
	)
}
