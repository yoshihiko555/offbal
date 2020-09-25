import Vue from 'vue'
import VueRouter from 'vue-router'
import pages from './pages'
import myapp from './myapp'
import setting from './setting'
import { setTitle, setDescription } from '@/mixins'

Vue.use(VueRouter)

const routes = [...pages, { ...myapp }, { ...setting }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
	setTitle(to.meta.title)
	setDescription(to.meta.description)
	next()
})

export default router
