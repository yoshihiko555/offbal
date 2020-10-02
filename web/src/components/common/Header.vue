<!-- サイトヘッダー -->
<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
            color='white'
        >
        	<v-row align='center'>
	            <h1 class='header_logo'>offbal</h1>

				<div class='header_navi_wrap'>
		            <vs-button
		            	v-show='!isAuth'
		            	@click='signin'
		            >
		            	SignIn
		            </vs-button>
	            </div>
            </v-row>
        </v-app-bar>
    </div>
</template>

<script>
import AuthService from '@/auth/AuthService'
const auth = new AuthService()

export default {
    name: 'Header',
    components: {
    },
    data: () => ({
		isAuth: false,
	}),
	created () {
    	// 認証済みじゃなかったらハッシュから認証情報を取得する
    	if (!auth.isAuthenticated()) {
			auth.handleAuthentication()
			auth.authNotifier.on('authChange', authState => {
                // 認証情報が変更された
                this.isAuth = authState.authenticated

                // auth0からユーザー情報の取得
                auth.getUserProfile((err, res) => {
                	if (err) {
                		console.log(err)
                	} else {
                		console.log(res)
                		const namespace = 'https://auth0/user_metadata'
                		// サインアップか判定
                		if (!res[namespace].signup) {
                            // サインアップなので初期データ作成画面へ
                            this.$router.push('/init-select-category')
                        } else {
                            // サインインなのでそのままアプリ画面へ
                            if (!this.isAuth) this.$router.push('/')
                            else this.$router.push('/myapp')
                        }
                	}
                })
            })
    	} else {
    		// 既に認証済みなら
            this.isAuth = auth.isAuthenticated()
            if (this.$route.name !== 'MyApp') this.$router.push('/myapp')
    	}
	},
    methods: {
    	signin () {
    		auth.login()
    	},
    }
}
</script>

<style lang="scss" scoped>
    #header::v-deep{
        .header_logo {
            margin-left: 2%;
        }
        .header_navi_wrap {
            margin-right: 2%;
            position: fixed;
            right: 0;
            display: inline-flex;
            align-items: center;
        }
    }
</style>