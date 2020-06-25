import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import dog from '../components/dog'
import MessageBox from 'element-ui/packages/message-box/src/main'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/dog' },
  { path: '/login', component: login },
  { path: '/dog', component: dog }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  if(to.path == '/login'){
    return next()
  }
  const token = window.localStorage.getItem('token')
  if(!token){
    next('/login')
  }else {
    next()
  }
})

export default router
