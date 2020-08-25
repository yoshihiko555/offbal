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

		            <vs-button
		            	dark
		            	v-show='isAuth'
		            	@click='signout'
		            >
		            	SignOut
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
    data: () => ({
		isAuth: false,
	}),
	created () {
    	// 認証済みじゃなかったらハッシュから認証情報を取得する
    	if (!auth.isAuthenticated()) {
			auth.handleAuthentication()
			auth.authNotifier.on('authChange', authState => {
                this.isAuth = authState.authenticated
                if (!this.isAuth) this.$router.push('/')
                else this.$router.push('/myapp')
                auth.getUserProfile((err, res) => {
                	if (err) {
                		console.log(err)
                	} else {
                		console.log(res)
                		const namespace = 'https://auth0/user_metadata'
                		// サインアップならmSetting等を作成する
                		if (!res[namespace].signup) this.initUserData(res.sub, res.name)
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
    	signout () {
    		auth.logout()
    	},
        handleAuthentication () {
  	    	auth.handleAuthentication()
   	    },
   	    initUserData (id, name) {
   	    	this.$axios({
   	    		url: '/api/signup/',
   	    		method: 'POST',
   	    		data: {
   	    			auth0_id: id,
   	    			auth0_name: name
   	    		}
   	    	})
   	    	.then(res => {
   	    		console.log(res)
   	    	})
   	    	.catch(e => {
   	    		console.log(e)
   	    	})
   	    }
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