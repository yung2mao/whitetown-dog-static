import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import dog from '../components/dog'
import welcome from '../components/welcome'
import user from '../components/auth/user'
import role from '../components/auth/role'
import menus from '../components/auth/menus'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/dog'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/dog',
    component: dog,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: welcome
    },
      {
        path: '/dog/auth/user',
        component: user
      },
      {
        path: '/dog/auth/role',
        component: role
      },
      {
        path: '/dog/auth/menu',
        component: menus
      }]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('token')
  if (to.path == '/login') {
    if (!token) {
      return next()
    } else {
      return next('/dog')
    }
  }
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
