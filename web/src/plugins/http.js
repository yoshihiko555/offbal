import Vue from 'vue'
import axios from 'axios'
import router from '@/router'

export default {
	install: function (Vue, options) {
		// デフォルト定義
		const http = axios.create({
			baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:8000/' : '',
			xsrfCookieName: 'csrftoken',
			xsrfHeaderName: 'X-CSRFTOKEN',
			timeout: 10000,
        })
		// リクエストのデフォルト定義
		// http.interceptors.request.use((config) => {
        //     if (Vue.prototype.$session.has('token')) {
        //         // ヘッダーに認証済みのToken埋め込み
		// 		config.headers = {
		// 			Authorization: `JWT ${Vue.prototype.$session.get('token')}`,
		// 			'Content-Type': 'application/json'
		// 		}
		// 	}
		// 	return config
		// })
		//  // レスポンスのデフォルト定義
		//  http.interceptors.response.use(
		// 		res => {
		// 			// リクエストデータのJSON解析
		// 			try {
        //                 if (!(res.config.data instanceof FormData)) {
        //                     var requestData = (res.config.data !== undefined) ? JSON.parse(res.config.data) : null
        //                     res.requestData = requestData
        //                 }
		// 			} catch (e) {
		// 				console.log(e)
		// 			} finally {
		// 			}
		// 			return res
		// 		},
		// 		e => {
		// 			// エラーコードのページに遷移
		// 			console.log('HTTP ERROR RESPONSE:', e.response)
		// 			// router.push(`/${e.response.status}`)
		// 			return Promise.reject(e)
		// 		}
		//  	)
		Vue.prototype.$axios = http
	}
}