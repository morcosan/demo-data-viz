import { CloseSvg, IconButton, SearchSvg, TextField } from '@ds/core'
import { t } from 'i18next'
import { debounce } from 'lodash'
import { type ReactNode, useMemo } from 'react'

interface Props {
  searchQuery: string
  setSearchQuery: (keyword: string) => void
  toolbar?: ReactNode
}

export const Toolbar = (props: Props) => {
  const handleSearchChange = useMemo(() => debounce((value: string) => props.setSearchQuery(value), 300), [props])

  return (
    <div className="m-xs-2 gap-xs-2 flex flex-wrap items-center justify-between">
      {props.toolbar}

      <TextField
        value={props.searchQuery}
        id="dataset-search"
        className="lg:max-w-lg-9 w-full"
        size="sm"
        placeholder={t('core.placeholder.search')}
        ariaLabel={t('dataViz.label.dataTableSearch')}
        prefix={<SearchSvg className="ml-xs-2 w-xs-5 mt-px" />}
        suffix={
          props.searchQuery && (
            <IconButton
              tooltip={t('core.action.clearSearch')}
              variant="text-subtle"
              size="xs"
              onClick={() => props.setSearchQuery('')}
            >
              <CloseSvg className="h-xs-7" />
            </IconButton>
          )
        }
        onChange={handleSearchChange}
      />
    </div>
  )
}
