const getUrlParams = (): URLSearchParams => new URLSearchParams(window.location.search)

const getUrlParam = (key: string): string | null => getUrlParams().get(key)
const getUrlParamArray = (key: string): string[] | null => {
  const value = getUrlParams().get(key)
  if (value === null) return null
  if (value === '') return []
  return value.split(',')
}

const setUrlParam = (key: string, value: string | string[]) => {
  const params = getUrlParams()
  if (Array.isArray(value) && !value.length) {
    params.set(key, '')
  } else {
    params.set(key, Array.isArray(value) ? value.join(',') : value)
  }
  window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
}

const deleteUrlParam = (key: string) => {
  const params = getUrlParams()
  params.delete(key)
  window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
}

export { deleteUrlParam, getUrlParam, getUrlParamArray, getUrlParams, setUrlParam }
