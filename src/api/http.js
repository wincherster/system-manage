import axios from 'axios'
import Vue from 'vue'
import EventBus from '../utils/EventBus.js'
window.requestCount = 0
axios.interceptors.request.use(defaults => {
  window.requestCount++
  EventBus.$emit('showLoadingMask', true)
  return defaults
}, err => {
  window.requestCount--
  if (window.requestCount <= 0) EventBus.$emit('showLoadingMask', false)
  return Promise.reject(err)
})
axios.interceptors.response.use(response => {
  window.requestCount--
  if (window.requestCount <= 0) EventBus.$emit('showLoadingMask', false)
  return response
}, err => {
  window.requestCount--
  if (window.requestCount <= 0) EventBus.$emit('showLoadingMask', false)
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.msg = '请求错误'
        break
      case 401:
        err.msg = '未授权，请登陆'
        break
      case 403:
        location.href = '/page/home/index.html'
        break
      case 404:
        err.msg = '请求地址有误：' + err.response.config.url
        break
      case 408:
        err.msg = '请求超时'
        break
      case 500:
        err.msg = '服务器内部错误'
        break
      case 501:
        err.msg = '服务未实现'
        break
      case 502:
        err.msg = '网关错误'
        break
      case 503:
        err.msg = '服务不可用'
        break
      case 504:
        err.msg = '网关超时'
        break
      case 505:
        err.msg = 'HTTP 版本不受支持'
        break
      default:
        err.msg = '网络错误'
    }
  } else {
    err.msg = '数据加载失败'
  }
  return Promise.reject(err)
})
axios.defaults.baseURL = process.env.API_ROOT
export default Vue.prototype.$http = {
  axios: axios,
  post: (url, param) => axios.post(url.replace(/\/+api/, ''), { parameter: param })
}
