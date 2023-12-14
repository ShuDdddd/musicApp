import axios from 'axios'
axios.interceptors.request.use(
  config => {
    const token = window.sessionStorage.getItem('token')
    token && (config.headers.token = token)
    return config
  },
  error => {
    return Promise.error(error)
  })
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
