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

/**
 * Object配列のソート
 */
export const objectArraySort = (data, key, order) => {
	 let numA = -1
	 let numB = 1
	 if (order === 'asc') {
		 numA = 1
		 numB = -1
	 }
	 data = data.sort(function (a, b) {
		 const x = a[key]
		 const y = b[key]
		 if (x > y) return numA
		 if (x < y) return numB
		 return 0
	 })
	 return data
}

/**
 * アプリページ遷移処理
 */
export const toAppPage = self => {
	if (self.$route.name !== 'MyApp') {
		self.$store.dispatch('appInitAction')
		.then(res => {
			self.$router.push('/myapp')
		})
		.catch(e => {
			if (!e.response.data.result) self.$router.push('/init-select-category')
		})
	}
}

/**
 * 設定情報からテーマを設定
 */
export const setTheme = (self, setting) => {
    const body = document.body
    body.removeAttribute('vs-theme')

    switch (setting.theme) {
    case ('default'):
        self.$vuetify.theme.isDark = false
        break

    case ('dark'):
        self.$vuetify.theme.isDark = true
        body.setAttribute('vs-theme', 'dark')
        break

    default:
        break
    }
}

export const globalMixins = {
		methods: {
			setTitle,
            setDescription,
			objectArraySort,
			toAppPage,
			setTheme
		}
}
