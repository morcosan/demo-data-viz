const getUrlParams = (): URLSearchParams => new URLSearchParams(window.location.search)

const getUrlParam = <T extends string | string[]>(key: string): T | null => {
  const value = getUrlParams().get(key)
  if (value === null) return null
  if (value.includes(',')) return value.split(',') as T
  return value as T
}

const setUrlParam = (key: string, value: string | string[]) => {
  const params = getUrlParams()
  const isEmpty = Array.isArray(value) ? !value.length : value === null
  if (isEmpty) {
    params.delete(key)
  } else {
    params.set(key, Array.isArray(value) ? value.join(',') : value)
  }
  window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
}

export { getUrlParam, getUrlParams, setUrlParam }
