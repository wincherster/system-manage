import axios from 'axios'
import Vue from 'vue'
import { Loading } from 'element-ui'
let loadingInstance
axios.interceptors.request.use(defaults => {
  loadingInstance = Loading.service({text: '玩命加载中...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.8)'})
  return defaults
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(response => {
  loadingInstance.close()
  return response
}, err => {
  loadingInstance.close()
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.msg = '请求错误'
        break
      case 401:
        err.msg = '未授权，请登陆'
        break
      case 403:
        err.msg = '拒绝访问'
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
        err.msg = '错误'
    }
  }
  return Promise.reject(err)
})
export default Vue.prototype.$http = {
  axios: axios,
  param: {parameter: {}},
  fullscreen: function () {
    return loadingInstance
  },
  post: function (url, args) {
    if (process.env.NODE_ENV === 'production') {
      url = process.env.API_ROOT + url.substring(4)
    }
    this.cheackUrl(url)
    this.copyArgs(args)
    url = url.replace('/page/home', '')
    return axios.post(url,
      JSON.stringify(this.param),
      {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
  },
  cheackUrl: function (url) {
    return (typeof url === 'string' && url.length > 0)
  },
  copyArgs: function (args) {
    if (typeof args === 'object' && args != null) {
      this.param.parameter = {}
      for (let attr in args) {
        this.param.parameter[attr] = args[attr]
      }
    }
  }
}
