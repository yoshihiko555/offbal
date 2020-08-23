<template>
    <div id="header">
        <v-app-bar
            app
            flat
            dense
            color='white'
        >
            <h1>offbal</h1>

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

            <vs-button
            	dark
            	@click='publicAPI'
            >
            	Public API Connect
            </vs-button>
            <vs-button
            	dark
            	@click='privateAPI'
            >
            	Private API Connect
            </vs-button>
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
   	    publicAPI () {
   	    	this.$axios({
   	    		url: '/api/public/',
   	    		method: 'GET',
   	    	})
   	    	.then(res => {
   	    		console.log(res)
   	    	})
   	    	.catch(e => {
   	    		console.log(e)
   	    	})
   	    },
   	    privateAPI () {
   	    	this.$axios({
   	    		url: '/api/private/',
   	    		method: 'GET',
   	    	})
   	    	.then(res => {
   	    		console.log(res)
   	    	})
   	    	.catch(e => {
   	    		console.log(e)
   	    	})
   	    },
    }
}
</script>

<style lang="scss">
</style>