import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
	install: function (Vue, options) {
		// デフォルト定義
		const http = axios.create({
			baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:8000/' : `${process.env.VUE_APP_AUTH_REDIRECT_URI}:8000/`,
			xsrfCookieName: 'csrftoken',
			xsrfHeaderName: 'X-CSRFTOKEN',
			timeout: 10000,
			headers: {
				common: {
					'Content-Type': 'application/json;charset=utf-8',
					'Access-Control-Allow-Origin': `${process.env.VUE_APP_AUTH_REDIRECT_URI}:8000`,
					'X-Requested-With': 'XMLHttpRequest',
					'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept',
					'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS, POST, GET'
				}
			}
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
