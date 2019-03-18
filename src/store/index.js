import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  sessionId: '',
  navTabs: [],
  activeTabValue: '0',
  activeTabName: 'send',
  fullscreenMode: false,
  authority: [],
  authorityMap: null,
  cacheData: {},
  newsCount: 0,
  //
  show: false, // 首页门店列表
  storeTypeFlag: '0', // 首页门店类型标志
  //
  storeParams: {} // 新增/编辑门店时需要传递参数过去：机构类型、机构对象、上级机构对象
}
const mutations = {
  getSessionId (state, sessionId) {
    state.sessionId = sessionId
  },
  addNavTab (state, navTab) {
    let navTabIndex = state.navTabs.findIndex(item => {
      return item.code === navTab.code
    })
    if (navTabIndex === -1) {
      state.navTabs.push(navTab)
    } else {
      state.navTabs.splice(navTabIndex, 1)
      state.navTabs.push(navTab)
    }
    state.activeTabValue = navTab.code
    sessionStorage.setItem('activeTabValue', state.activeTabValue)
    sessionStorage.setItem('navTabs', JSON.stringify(state.navTabs))
  },
  removeTab (state, targetTabValue) {
    let navTabIndex = state.navTabs.findIndex(item => {
      return item.code === targetTabValue
    })
    if (navTabIndex >= 0) {
      if (targetTabValue === state.activeTabValue) {
        let newActiveTab = state.navTabs[navTabIndex + 1] || state.navTabs[navTabIndex - 1]
        state.navTabs.splice(navTabIndex, 1)
        if (newActiveTab) {
          state.activeTabValue = newActiveTab.code
        } else {
          state.activeTabValue = '0'
        }
      } else {
        state.navTabs.splice(navTabIndex, 1)
      }
    }
    sessionStorage.setItem('navTabs', JSON.stringify(state.navTabs))
    sessionStorage.setItem('activeTabValue', state.activeTabValue)
  },
  changeActiveTab (state, newActiveTabValue) {
    state.activeTabValue = newActiveTabValue
    sessionStorage.setItem('navTabs', JSON.stringify(state.navTabs))
    sessionStorage.setItem('activeTabValue', state.activeTabValue)
  },
  initNavTabs (state) {
    state.activeTabValue = sessionStorage.getItem('activeTabValue') || '0'
    state.navTabs = JSON.parse(sessionStorage.getItem('navTabs')) || []
  },
  setFullscreenMode (state, value) {
    state.fullscreenMode = value
  },
  removeAllTab (state) {
    state.activeTabValue = '0'
    state.navTabs = []
    sessionStorage.setItem('navTabs', JSON.stringify(state.navTabs))
    sessionStorage.setItem('activeTabValue', state.activeTabValue)
  },
  setCacheData (state, obj) {
    state.cacheData = obj
  },
  clearCacheData (state) {
    state.cacheData = ''
  },
  slideShow (state) {
    state.show = !state.show
  },
  storeTypeFlag (state, storeTypeFlag) {
    state.storeTypeFlag = storeTypeFlag
  },

  setStoreParams (state, storeParams) { // 设置门店参数
    state.storeParams = storeParams
  },
  setNewsCount (state, value) {
    state.newsCount = value
  },
  setAuthority (state, value) {
    state.authority = value
    sessionStorage.setItem('authority', JSON.stringify(value))
  },
  setAuthorityMap (state, authorityData) {
    if (authorityData != null) {
      state.authorityMap = {}
      for (let i = 0; i < authorityData.length; i++) {
        let item = authorityData[i]
        if (/^\/.{2,}/.test(item.modulIdLinkUrl)) {
          let routeAuth = item
          let id = routeAuth.modulId
          let optAuth = {}
          for (let j = 0; j < authorityData.length; j++) {
            let item = authorityData[j]
            if (item.fatherModulId === id) {
              optAuth[item.modulIdLinkUrl.trim()] = true
            }
          }
          state.authorityMap[routeAuth.modulIdLinkUrl.replace(/(\r\n)+/, '')] = optAuth
        }
      }
      sessionStorage.setItem('AUTHORITYMAP', JSON.stringify(state.authorityMap))
    }
  }
}
const actions = {
  addNavTab (context, navTab) {
    context.commit('addNavTab', navTab)
  },
  removeTab (context, targetTabValue) {
    context.commit('removeTab', targetTabValue)
  },
  changeActiveTab (context, newActiveTabValue) {
    context.commit('changeActiveTab', newActiveTabValue)
  },
  initNavTabs (context) {
    context.commit('initNavTabs')
  },
  setFullscreenMode (context, value) {
    context.commit('setFullscreenMode', value)
  },
  removeAllTab (context) {
    context.commit('removeAllTab')
  },
  setStoreParams (context, storeParams) {
    context.commit('setStoreParams', storeParams)
  }
}
const getters = {
  sessionId: state => state.sessionId,
  show: state => state.show,
  storeTypeFlag: state => state.storeTypeFlag, // 门店类型标志

  getNavTabs (state) {
    return state.navTabs
  },
  getActiveTabValue (state) {
    return state.activeTabValue
  },
  getFullscreenMode (state) {
    return state.fullscreenMode
  },
  getStoreParams (state) {
    return state.storeParams
  },
  getNewsCount (state) {
    return state.newsCount
  },
  getAuthority (state) {
    if (state.authority.length > 0) {
      return state.authority
    } else {
      return JSON.parse(sessionStorage.getItem('authority'))
    }
  },
  getAuthorityMap (state) {
    if (state.authorityMap) {
      return state.authorityMap
    } else {
      return JSON.parse(sessionStorage.getItem('AUTHORITYMAP'))
    }
  }
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
