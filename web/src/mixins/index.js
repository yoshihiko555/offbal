/**
 * Titleの設定
 */
export const setTitle = pathTitle => {
	const siteTitle = 'offbal'
	const pageTitle = !pathTitle ? siteTitle : `${pathTitle} | ${siteTitle}`
	return (window.document.title = pageTitle)
}

/**
 * Descriptionの設定
 */
export const setDescription = pathMeta => {
	const defaultDescription = 'ようこそ offbalへ!!'
	const description = pathMeta ? pathMeta : defaultDescription
	document
		.querySelector("meta[name='description']")
		.setAttribute('content', description)
}

export const globalMixins = {
		methods: {
			setTitle,
            setDescription,
		}
}