
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/iconfont/iconfont.js'
import './assets/iconfont/icon.css'
import elementUi from './plugin/elementUi.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css'
import './assets/normal.css'
import './assets/commons.css'
import $ from 'jquery'
import axios from 'axios'
import store from './store'

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios
Vue.config.productionTip = false
window.$ = $
// 兄弟间组件通讯
Vue.prototype.$bus = new Vue()
// 导航
router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/my') === 0 && window.sessionStorage.getItem('isLogin') === 0) {
    console.log('守卫')
    next({ name: 'tologin' })
  }
  next()
})
console.log(router)
const originalPush = router.prototype.push
// 修改原型对象中的push方法
router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 解决vue路由重复导航错误
// 获取原型对象上的push函数

// 元素外部点击隐藏（还能写功能更全的的，以后再试
Vue.directive('clickOutside', {
  bind (el, binding) {
    function clickHandler (e) {
      if (e) {
        if (el.parentNode.contains(e.target)) {
          el.style.display = 'block'
          return false
        }
        el.style.display = 'none'
      }
    }
    el.__vueClickout__ = clickHandler()
    document.addEventListener('click', clickHandler)
  },
  unbind (el) {
    document.removeEventListener('click', el.__vueClickout__)
    delete el.__vueClickout__
  }
})
// 管道
// 将数据转换成00：00形式
Vue.filter('timeFormat', function (second) {
  if (!second) {
    return '00:00'
  }
  const result = parseInt(second)
  const m = (parseInt(result / 60) + '').padStart(2, '0')
  const s = (result % 60 + '').padStart(2, '0')
  return `${m}:${s}`
})
// 数据转化成年-月-日
Vue.filter('dateFormat', function (time) {
  const dt = new Date(time)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + 1 + '').padStart(2, '0')
  return y + '-' + m + '-' + d
})
// 数据换成“xxx万”的格式
Vue.filter('millionFormat', function (count) {
  if (count < 9999) {
    return count
  }
  const result = parseInt(count / 10000)
  return result + '万'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}).use(elementUi)
