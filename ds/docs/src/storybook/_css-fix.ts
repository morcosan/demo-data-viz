const removeBrokenCSS = () => {
	const needle = 'sb-unstyled'

	for (const sheet of document.styleSheets) {
		try {
			for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
				const text = sheet.cssRules[i].cssText || ''
				if (text.includes(needle)) {
					sheet.deleteRule(i)
				}
			}
		} catch (err) {
			console.error(`Failed to remove ${needle}`, err)
		}
	}
}

const fixBrokenCSS = () => {
	// Watch for future <style> / <link> insertions
	new MutationObserver(removeBrokenCSS).observe(document.head, {
		childList: true,
		subtree: true,
	})
}

export { fixBrokenCSS }
