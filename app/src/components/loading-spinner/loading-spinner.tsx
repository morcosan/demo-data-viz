import { useDefaults } from '@ds/core.ts'
import { Loader } from '@mantine/core'
import { useTranslation } from 'react-i18next'

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
