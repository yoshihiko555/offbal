import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'
import router from './../router'
const axios = require('axios')
const qs = require('qs')

export default class AuthService {
    authenticated = this.isAuthenticated()
    authNotifier = new EventEmitter()

    constructor () {
        this.login = this.login.bind(this)
        this.setSession = this.setSession.bind(this)
        this.logout = this.logout.bind(this)
        this.isAuthenticated = this.isAuthenticated.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.updateUserProfile = this.updateUserProfile.bind(this)
    }

    // auth0.WebAuth のインスタンスをAPI および Client
    // 資格情報で作る
    auth0 = new auth0.WebAuth({
        domain: 'dev-orr54nx8.us.auth0.com',
        clientID: 'PBarwrwjyH8XR7ItR9dTVKilLZRhhEeh',
        redirectUri: process.env.VUE_APP_AUTH_REDIRECT_URI,
        audience: 'https://offbal-api.com.br',
        responseType: 'token id_token',
        scope: 'openid profile email'
    });

    // このメソッドは Auth0 ログインページが
    // トリガーされる authorize() メソッドを呼び出す
    login () {
        this.auth0.authorize()
    }

    // このメソッドはコールバック URL から認証情報を得るために
    // Auth0 の parseHash() メソッドを呼び出す
    handleAuthentication () {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult)
            } else if (err) {
                console.log(err)
                alert(`Error: ${err.error}. Check the console for further details.`)
            }
        })
    }

    // ユーザーの access\_token、id\_token、および access\_token が
    // ローカル ストレージで期限切れになる時間を格納する
    setSession (authResult) {
    // アクセス トークンが時間切れになる時間を設定し
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        )
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)
        localStorage.setItem('auth0_id', authResult.idTokenPayload.sub)
        localStorage.setItem('username', authResult.idTokenPayload.name)
        localStorage.setItem('email', authResult.idTokenPayload.email)
        localStorage.setItem('picture', authResult.idTokenPayload.picture)
        this.authNotifier.emit('authChange', { authenticated: true })
    }

    // そのアクセスと ID トークンをローカル ストレージから削除し、
    // authChange イベントを発行し
    logout () {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.removeItem('expires_at')
        localStorage.removeItem('auth0_id')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('picture')
        this.authNotifier.emit('authChange', false)
        // ホームルートに移動する
		if (router.currentRoute.fullPath !== '/') {
			router.replace('/')
		}
    }

    // そのユーザーが認証されているか確認する
    isAuthenticated () {
        // 現在の時間がアクセストークンの
        // 有効期限を過ぎているかを確認する
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
        return new Date().getTime() < expiresAt
    }

    // ユーザー プロファイルを得るメソッド
    getUserProfile (cb) {
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) return this.auth0.client.userInfo(accessToken, cb)
        else return null
    }

    // 管理APIを操作するインスタンスの作成
    async initAuthManage () {
        const res = await AuthService.getManageAPIToken().catch(e => e)
        console.log('管理APIトークン情報:', res)
        if (res.data) {
            const token = res.data.access_token
            const auth0Manage = new auth0.Management({
                domain: process.env.VUE_APP_AUTH_DOMAIN,
                token: token,
            })
            return auth0Manage
        } else {
            throw new Error('トークンの取得に失敗しました')
        }
    }

    // 管理APIからユーザー情報を取得
    async getManageUserProfile (cb) {
        try {
            const auth0Manage = await this.initAuthManage()
            const authId = AuthService.getAuth0Id()
            return auth0Manage.getUser(authId, cb)
        } catch (e) {
            console.error(e)
            throw new Error('ユーザー情報の取得に失敗しました。')
        }
    }

    // 管理APIによるユーザー情報の更新
    async updateUserProfile (data, cb) {
        console.log('更新ユーザープロフィール', data)
        try {
            const auth0Manage = await this.initAuthManage()
            const authId = AuthService.getAuth0Id()
            auth0Manage.patchUserAttributes(authId, data, cb)
        } catch (e) {
            console.error(e)
            throw new Error('ユーザー情報の更新に失敗しました。')
        }
    }

    // 管理APIによるユーザーメタデータの更新
    async updateUserMetadata (data, cb) {
    	console.log('更新ユーザーメタデータ', data)
    	try {
    		const auth0Manage = await this.initAuthManage()
    		const authId = AuthService.getAuth0Id()
    		auth0Manage.patchUserMetadata(authId, data, cb)
    	} catch (e) {
    		console.error(e)
    		throw new Error('ユーザーメタデータの更新に失敗しました。')
    	}
    }

    /**
     * パスワードリセットのメールを送信する
     */
    sendResetPasswordMail (connection, email) {
    	this.auth0.changePassword({
    		connection: 'Username-Password-Authentication',
    		email: email,
    	}, function (err, res) {
    		if (err) {
    			console.log(err)
    		} else {
    			console.log(res)
    		}
    	})
    }

    /**
     * Auth0のユーザーを削除する
     */
    deleteUser (sub) {
    	AuthService.getManageAPIToken()
    	.then(res => {
    		console.log(res)
    		axios({
                url: '/api/auth/delete_auth_user/',
                method: 'DELETE',
                data: {
                    url: `https://${process.env.VUE_APP_AUTH_DOMAIN}/api/v2/users/${sub}`,
                    headers: { Authorization: `Bearer ${res.data.access_token}` },
                }
    		})
    		.then(res => {
    			console.log(res)
    		})
    		.catch(e => {
    			console.log(e)
    		})
    	})
    	.catch(e => {
    		console.log(e)
    	})
    }

    /*********************************
     * 静的メソッド
     ********************************/

    // アクセストークンを得る静的メソッド
    static getAuthToken () {
        return localStorage.getItem('access_token')
    }

    // Auth0Idを取得する静的メソッド
    static getAuth0Id () {
    	return localStorage.getItem('auth0_id')
    }

    // Usernameを取得する静的メソッド
    static getUserName () {
    	return localStorage.getItem('username')
    }

    // メールアドレスを取得する静的メソッド
    static getEmail () {
    	return localStorage.getItem('email')
    }

    // ユーザーアイコン画像を取得する静的メソッド
    static getProfileImg () {
    	return localStorage.getItem('picture')
    }

    // 管理APIへのアクセストークンを取得する静的メソッド
    static getManageAPIToken () {
        const http = axios.create({
            baseURL: `${process.env.VUE_APP_AUTH_REDIRECT_URI}:8000/`,
			xsrfCookieName: 'csrftoken',
			xsrfHeaderName: 'X-CSRFTOKEN',
			timeout: 10000,
        })
        const options = {
            url: '/api/auth/get_oauth_token/',
            method: 'POST',
            data: {
                url: `https://${process.env.VUE_APP_AUTH_DOMAIN}/oauth/token`,
                grant_type: 'client_credentials',
    	    	client_id: process.env.VUE_APP_MANAGE_CLIENT_ID,
    	    	client_secret: process.env.VUE_APP_MANAGE_CLIENT_SECRET,
    	    	audience: `https://${process.env.VUE_APP_AUTH_DOMAIN}/api/v2/`,
            }
        }
        return http(options)
    }
}
