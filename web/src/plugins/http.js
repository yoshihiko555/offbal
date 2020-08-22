import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

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
		http.interceptors.request.use((config) => {
			if (auth.isAuthenticated) {
				config.headers = {
						Authorization: `Bearer ${AuthService.getAuthToken()}`,
						'Content-Type': 'application/json'
				}
			}
		 	return config
		 })
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