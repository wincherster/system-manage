import 'babel-polyfill'
import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/saas-icon.css'
import './assets/css/element-resetui.css'
import './assets/css/saasui.css'
import './assets/css/animate.css'
import './assets/less/saas-tabbar.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import ElementUI from 'element-ui'
import './api/http'
import './api/resurce'
import DateUtil from './utils/DateUtil.js'
import loadingMask from './components/loadingMask.vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.use(iView)
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})
router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
Vue.filter('dateFilter', (value, type, format) => DateUtil.dateFilter(value, type, format))
Vue.component('loadingMask', loadingMask)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: c => c(App)
})
