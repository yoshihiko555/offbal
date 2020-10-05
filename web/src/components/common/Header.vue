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
	}),
	created () {
    	// 認証済みじゃなかったらハッシュから認証情報を取得する
    	if (!auth.isAuthenticated()) {
			auth.handleAuthentication()
			auth.authNotifier.on('authChange', authState => {
                // 認証情報が変更された
                auth.getManageUserProfile((err, res) => {
                	if (err) {
                		console.log(err)
                	} else {
                		console.log('ユーザー情報:', res)
                		if (res.user_metadata.signup) {
                			// サインアップ完了
                			this.toAppPage(this)
                		} else {
                			// サインアップ未完了なので初期データ作成画面へ遷移
                			this.$router.push('/init-select-category')
                		}
                	}
                })
            })
    	} else {
    		// 既に認証済みなら
            this.toAppPage(this)
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