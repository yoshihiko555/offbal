import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'
import router from './../router'

export default class AuthService {
    authenticated = this.isAuthenticated()
    authNotifier = new EventEmitter()

    constructor () {
        this.login = this.login.bind(this)
        this.setSession = this.setSession.bind(this)
        this.logout = this.logout.bind(this)
        this.isAuthenticated = this.isAuthenticated.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.updateUsermetadata = this.updateUsermetadata.bind(this)
        this.myGetUser = this.myGetUser.bind(this)
    }

    // auth0.WebAuth のインスタンスをAPI および Client
    // 資格情報で作る
    auth0 = new auth0.WebAuth({
        domain: 'dev-orr54nx8.us.auth0.com',
        clientID: 'PBarwrwjyH8XR7ItR9dTVKilLZRhhEeh',
        redirectUri: 'http://localhost:8080',
        // audience: 'https://dev-orr54nx8.us.auth0.com/api/v2/',
        audience: 'https://offbal-api.com.br',
        responseType: 'token id_token',
        scope: 'openid profile email'
    });

    updateUsermetadata () {
//        const auth0Manage = new auth0.Management({
//            domain: 'dev-orr54nx8.us.auth0.com',
//            token: AuthService.getAuthToken(),
//        })
    	const auth0Manage = new auth0.Management({
            domain: 'dev-orr54nx8.us.auth0.com',
            token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJJWE1GQnNPS0J1bEpya0p1Q3QxXyJ9.eyJpc3MiOiJodHRwczovL2Rldi1vcnI1NG54OC51cy5hdXRoMC5jb20vIiwic3ViIjoieDNHQXRQQ2lXR2l1SU5UYnA3NG5HbWhaWVBTT1RZaVNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW9ycjU0bng4LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjAwMzA2MTc3LCJleHAiOjE2MDAzOTI1NzcsImF6cCI6IngzR0F0UENpV0dpdUlOVGJwNzRuR21oWllQU09UWWlTIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.0KWYnHwtauLAphGIQB4DgoqTIspZFQpu-wWp7xqhwMVbzY2ECRikkxXDeWe9yjs-UZ25gvuwtt80TRUw0N5yMgYe1KspYpAqFURrEv4yuKjxqY82Yxm1Tnl24RDdRV5Oya5Q-IftMt5kCQNpZpqX94UV5Td9zQYyLpyUoBXH1vRwy-qHHtmKsnQyiR-8lQTQYz89Cjr27TBFhUJ9upd39RY22JNim21dYa1cORS6ppxgNpnbHUqMNDH9XZa-ZcataZ6PeEJeEzXdLNIF4UUI8QwEmsn4huHG0nRw8Hpbw0J74M_Qqm_CU4yIWT1gICwD3dmd9UH_vwaPmr1lHOVleA',
    	})
//        const userId = AuthService.getAuth0Id()
        const userId = 'google-oauth2|115519955424057405956'
        const userMetadata = { test: false }
        console.log('Manage情報', auth0Manage)
        console.log('auth0情報', this.auth0)
        auth0Manage.patchUserMetadata(userId, userMetadata, function (err, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(res)
            }
        })
    }

    myGetUser () {
    	const auth0Manage = new auth0.Management({
            domain: 'dev-orr54nx8.us.auth0.com',
            token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJJWE1GQnNPS0J1bEpya0p1Q3QxXyJ9.eyJpc3MiOiJodHRwczovL2Rldi1vcnI1NG54OC51cy5hdXRoMC5jb20vIiwic3ViIjoieDNHQXRQQ2lXR2l1SU5UYnA3NG5HbWhaWVBTT1RZaVNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW9ycjU0bng4LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjAwMzA2MTc3LCJleHAiOjE2MDAzOTI1NzcsImF6cCI6IngzR0F0UENpV0dpdUlOVGJwNzRuR21oWllQU09UWWlTIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.0KWYnHwtauLAphGIQB4DgoqTIspZFQpu-wWp7xqhwMVbzY2ECRikkxXDeWe9yjs-UZ25gvuwtt80TRUw0N5yMgYe1KspYpAqFURrEv4yuKjxqY82Yxm1Tnl24RDdRV5Oya5Q-IftMt5kCQNpZpqX94UV5Td9zQYyLpyUoBXH1vRwy-qHHtmKsnQyiR-8lQTQYz89Cjr27TBFhUJ9upd39RY22JNim21dYa1cORS6ppxgNpnbHUqMNDH9XZa-ZcataZ6PeEJeEzXdLNIF4UUI8QwEmsn4huHG0nRw8Hpbw0J74M_Qqm_CU4yIWT1gICwD3dmd9UH_vwaPmr1lHOVleA',
    	})
    	const userId = 'google-oauth2|115519955424057405956'
    	auth0Manage.getUser(userId, function (err, res) {
    		if (err) {
    			console.log(err)
    		} else {
    			console.log(res)
    		}
    	})
    }

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

    // ユーザー プロファイルを得るメソッド
    getUserProfile (cb) {
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) return this.auth0.client.userInfo(accessToken, cb)
        else return null
    }
}
