import Vue from 'vue'
import VueRouter from 'vue-router'
import pages from './pages'
import register from './register'

Vue.use(VueRouter)

const routes = [...pages, ...register]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
