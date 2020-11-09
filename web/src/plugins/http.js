import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
	install: function (Vue, options) {
		// デフォルト定義
		const http = axios.create({
			baseURL: process.env.VUE_APP_BASE_URL,
			// baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:8000/' : 'http://ec2-52-196-50-93.ap-northeast-1.compute.amazonaws.com:8000/',
			xsrfCookieName: 'csrftoken',
			xsrfHeaderName: 'X-CSRFTOKEN',
			timeout: 10000,
        })
		// リクエストのデフォルト定義
		http.interceptors.request.use((config) => {
			if (auth.isAuthenticated) {
				config.headers = {
						Authorization: `Bearer ${AuthService.getAuthToken()}`,
						'Content-Type': 'application/json',
				}

				// auth0_idを格納
				if (config.method === 'get') {
					config.params = config.params || {}
                    config.params.auth0_id = AuthService.getAuth0Id()
                } else if (config.method === 'delete') {
                    // deleteは何もしない
				} else {
					// それ以外は全てdataにauth0_idを格納
					config.data.auth0_id = AuthService.getAuth0Id()
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