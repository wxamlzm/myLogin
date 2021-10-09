import Vue from 'vue'
import VueRouter from 'vue-router'
// import Register from '../views/register.vue'
import Index from '../views/Index.vue'
// import Login from '../views/login.vue'
// import NotFound from '../views/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import( /* webpackChunkName: "Register" */ '../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import( /* webpackChunkName: "NotFound" */ '../views/NotFound.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
