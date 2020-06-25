import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:10003/'
//请求拦截，在请求头添加token
axios.interceptors.request.use(config=>{
  var token = window.localStorage.getItem("token")
  if(token != null) {
    config.headers.Authorization = token
  }
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
