'use client'

import { useTranslation } from '@app-i18n'
import { Loader } from '@mantine/core'

interface Props extends ReactProps {
  size?: 'xs' | 'sm'
}

export const LoadingSpinner = ({ size = 'sm' }: Props) => {
  const { t } = useTranslation()

  return (
    <div className={cx('flex items-center', size === 'xs' ? 'text-size-sm gap-xs-3' : 'text-size-md gap-xs-4')}>
      <Loader color="gray" size={size} />
      {t('core.status.loading')}
    </div>
  )
}
