const TAB_INDEX_SELECTOR = [
  '[tabindex]:not([tabindex="-1"])',
  'button',
  'input',
  'select',
  'textarea',
  'a[href]',
  'summary',
  '[contenteditable="true"]',
]
  .map((selector: string) => `${selector}:not(:disabled):not([disabled])`)
  .join(', ')

const queryElementsWithTabIndex = (root: HTMLElement): HTMLElement[] => {
  return Array.from(root.querySelectorAll<HTMLElement>(TAB_INDEX_SELECTOR))
    .filter(isElementVisible)
    .filter((elem: HTMLElement) => elem.tabIndex > -1)
}

const isElementVisible = (elem: HTMLElement): boolean => {
  // Cheapest checks
  if (elem.hidden) return false
  if (elem.style.display === 'none') return false
  if (elem.style.visibility === 'hidden') return false

  // Use browser API if available
  if (typeof elem.checkVisibility === 'function') {
    return elem.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
  }

  // Fallback - no reflow
  const computedStyle = window.getComputedStyle(elem)
  if (computedStyle.display === 'none') return false
  if (computedStyle.visibility === 'hidden' || computedStyle.visibility === 'collapse') return false

  // Fallback - with reflow
  const rect = elem.getBoundingClientRect()
  return rect.height > 0 && rect.width > 0
}

export { isElementVisible, queryElementsWithTabIndex }
