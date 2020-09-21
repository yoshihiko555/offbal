import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '@/plugins/http'
import vuetify from './plugins/vuetify'
import Vuesax from 'vuesax'
import VueSession from 'vue-session'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import myRules from '@/assets/js/rules'
import { globalMixins } from '@/mixins'
import eventHub from '@/plugins/eventHub'
import truncate from '@/filters/truncate'

// CSS
import 'vuesax/dist/vuesax.css'
import 'boxicons/css/boxicons.min.css'
require('@/assets/scss/main.scss')

Vue.config.productionTip = false

Vue.use(http)
Vue.use(Vuesax, {
	colors: {
		primary: '#03A9F4',
//		primary: '#40e0d0',
	}
})
Vue.use(VueSession)

Vue.use(eventHub)

Vue.mixin(globalMixins)

// ルールの呼び出し
myRules()

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
