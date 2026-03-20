'use client'

import { useTranslation } from '@app-i18n'
import { CloseSvg, IconButton, SearchSvg, TextField } from '@ds/core'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from '../tooltip/tooltip'

export interface SearchFieldProps extends ReactProps {
  id: string
  value: string
  label: string
  disabled?: boolean
  onChange: (value: string) => void
}

export const SearchField = (props: SearchFieldProps) => {
  const { t } = useTranslation()
  const { onChange } = props
  const [query, setQuery] = useState(props.value)

  const changeQuery = useCallback(
    (value: string) => {
      setQuery(value)
      onChange(value)
    },
    [onChange],
  )
  const handleQueryChange = useMemo(() => debounce(changeQuery, 300), [changeQuery])

  useEffect(() => {
    setQuery(props.value)
  }, [props.value])

  return (
    <Tooltip label={props.label}>
      <TextField
        value={query}
        disabled={props.disabled}
        id={props.id}
        size="sm"
        placeholder={t('core.placeholder.search')}
        ariaLabel={props.label}
        prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
        suffix={
          query && (
            <IconButton
              tooltip={t('core.action.clearSearch')}
              variant="text-subtle"
              size="xs"
              onClick={() => handleQueryChange('')}
            >
              <CloseSvg className="h-xs-7" />
            </IconButton>
          )
        }
        className={props.className}
        style={props.style}
        onChange={handleQueryChange}
      />
    </Tooltip>
  )
}
