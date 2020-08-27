import Vue from 'vue'
import VueRouter from 'vue-router'
import pages from './pages'
import myapp from './myapp'

Vue.use(VueRouter)

const routes = [...pages, { ...myapp }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
