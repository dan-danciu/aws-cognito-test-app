import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import { store } from './store/index'

Vue.use(VueRouter)

export const router = new VueRouter({mode: 'history', routes})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.authentication.access_token) {
      next({
        name: 'login'
        //query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
