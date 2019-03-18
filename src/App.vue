<template>
  <div id="app" ref="app">
    <div class="aside" v-if='!fullscreenMode'>
      <saas-nav></saas-nav>
    </div>
    <div class="container">
      <div class="header" v-if='!fullscreenMode'>
        <saas-header></saas-header>
      </div>
      <div class="tabBar">
        <saas-tabbar></saas-tabbar>
      </div>
      <div class="body-main">
        <div class="main">
          <router-view v-if="isAlive"></router-view>
        </div>
      </div>
      <div class="footer">
        <saas-footer></saas-footer>
      </div>
    </div>
    {{getFullscreenMode}}
    <transition name="el-fade-in">
      <loadingMask v-if="showLoadingMask"></loadingMask>
    </transition>
  </div>
</template>
<script>
  import saasNav from '@/components/saasNav.vue'
  import saasHeader from '@/components/saasHeader.vue'
  import saasTabBar from '@/components/saasTabBar.vue'
  import saasFooter from '@/components/saasFooter.vue'
  import EventBus from './utils/EventBus.js'
  export default {
    components: {
      'saas-nav': saasNav,
      'saas-footer': saasFooter,
      'saas-tabbar': saasTabBar,
      'saas-header': saasHeader
    },
    data () {
      return {
        fullscreenMode: false,
        showLoadingMask: false,
        isAlive: true
      }
    },
    computed: {
      getFullscreenMode () {
        this.fullscreenMode = this.$store.getters.getFullscreenMode
      }
    },
    created () {
      this.$http.post('/api/homepage/hp/queryAuthModInfo')
        .then(res => {
          if (res.data.code === '0') {
            this.setAuthority(res.data.data)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
      EventBus.$on('showLoadingMask', isShow => {
        this.showLoadingMask = isShow
      })
      this.$store.dispatch('initNavTabs')
      this.setAuthority()
      EventBus.$on('reloadRouter', () => {
        this.reloadRouter()
      })
    },
    methods: {
      reloadRouter () {
        this.isAlive = false
        this.$nextTick(() => (this.isAlive = true))
      },
      setAuthority () {
        this.$http
          .post('/api/homepage/hp/queryAuthModInfo', {})
          .then(res => {
            try {
              if (res.data.code === '0') {
                this.$nextTick(() => {
                  this.$store.commit('setAuthority', res.data.data)
                  this.$store.commit('setAuthorityMap', res.data.data)
                })
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              console.log(error)
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      }
    }
  }
</script>
<style lang="less" scoped>
  #app {
    width: 100%;
    height: 100%;
    display: flex;
    min-width: 1024px;
    min-height: 640px;
    overflow: hidden;
    .aside {
      background-color: #262626;
      max-width: 160px;
      min-width: 70px;
      width: auto;
      height: 100%;
      box-shadow: 0 0 10px 0 rgba(33, 35, 41, 0.6);
      * {
        transition: all 1s;
      }
    }
    .container {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #F4F9FC;
      .header {
        height: 46px;
        width: 100%;
        background: #fff;
        box-shadow: 0 0 15px 0 rgba(33, 41, 50, 0.05);
      }
      .tabBar {
        height: 36px;
        width: 100%;
        background: #ffffff;
        position: relative;
      }
      .body-main {
        flex: 1;
        position: relative;
        background: #F4F9FC;
        .main {
          background-color: #fff;
          position: absolute;
          left: 16px;
          right: 16px;
          top: 16px;
          bottom: 0px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .container {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          background: #F4F9FC;
          .header {
            height: 46px;
            width: 100%;
            background: #fff;
            box-shadow: 0 0 15px 0 rgba(33, 41, 50, 0.05);
          }
          .tabBar {
            height: 36px;
            width: 100%;
            background: #ffffff;
            position: relative;
          }
          .body-main {
            flex: 1;
            position: relative;
            background: #F4F9FC;
            .main {
              overflow-y: auto;
              overflow-x: hidden;
              background-color: #fff;
              position: absolute;
              left: 16px;
              right: 16px;
              top: 16px;
              bottom: 0px;
            }
          }
          .footer {
            height: 30px;
            width: 100%;
            background: #F4F9FC;
          }

        }
      }
    }
  }
</style>
<style lang="less">
  @import "assets/css/saas-table.less";
</style>
