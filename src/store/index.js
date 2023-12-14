import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state () {
    return {
      user: {}, // 存储登录用户信息 id, img, name
      isLogin: false // 记录登录状态
    }
  },
  getters: {},
  mutations: {
    updateUser (state, data) {
      state.user = data
    },
    updateLogStatus (state, bool) {
      state.isLogin = bool
    }
  },
  actions: {},
  modules: {}
})
