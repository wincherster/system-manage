<template>
  <div class='nav-tabs'>
    <span class="prev"><i class="el-icon-d-arrow-left"></i></span>
    <span class="next"><i class="el-icon-d-arrow-right"></i></span>
    <el-tabs
      v-model='activeTabValue'
      @tab-remove="removeTab"
      @tab-click="changeActiveTab"
      closable>
      <el-tab-pane label='首页' name='0' class='home'></el-tab-pane>
      <el-tab-pane v-for='(item, index) in navTabs' :key='index' :label='item.title' :name='item.code'>
      </el-tab-pane>
      {{getNavTabs}}
    </el-tabs>
    <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="saas saas-nav-abbrdropdown"></i>
          </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command='closeall'>
          <i class="el-icon-circle-close-outline"></i><span>关闭所有</span>
        </el-dropdown-item>
        <el-dropdown-item command='reload'>
          <i class="saas saas-header-refresh"></i><span>刷新</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <full-screen v-model="isFullScreen"></full-screen>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  import fullScreen from '@/components/fullscreen.vue'
  import EventBus from '../utils/EventBus.js'
  export default {
    created () {
      this.initData()
    },
    data () {
      return {
        activeTabValue: '',
        navTabs: [],
        isFullScreen: false
      }
    },
    methods: {
      initData () {
        this.navTabs = this.$store.getters.getNavTabs
        this.activeTabValue = this.$store.getters.getActiveTabValue
      },
      removeTab (targetTabValue) {
        this.$store.dispatch('removeTab', targetTabValue)
      },
      changeActiveTab (targetTab) {
        this.$store.dispatch('changeActiveTab', targetTab.name)
      },
      handleCommand (command) {
        if (command === 'closeall') {
          this.$store.dispatch('removeAllTab')
        } else if (command === 'reload') {
          EventBus.$emit('reloadRouter')
        } else if (command === 'fullscreen') {
          this.$store.dispatch('setFullscreenMode', true)
        } else if (command === 'exitfullscreen') {
          this.$store.dispatch('setFullscreenMode', false)
        }
      }
    },
    computed: {
      getNavTabs () {
        this.navTabs = null
        this.navTabs = this.$store.getters.getNavTabs
        this.activeTabValue = this.$store.getters.getActiveTabValue
      }
    },
    watch: {
      activeTabValue (newValue, oldValue) {
        let activeTab = this.navTabs.find(item => {
          return item.code === newValue
        })
        if (activeTab) {
          this.$router.push({path: activeTab.router})
        } else {
          this.$router.push('/index')
        }
      }
    },
    components: {
      'fullScreen': fullScreen
    }
  }
</script>
<style scoped lang="less">
  .nav-tabs {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .nav-tabs .prev,
  .nav-tabs .next {
    position: absolute;
    top: 0;
    width: 30px;
    height: 36px;
    padding: 12px 0;
    z-index: 0;
    text-align: center;
    cursor: pointer;
    line-height: 12px;
  }
  .nav-tabs .prev {
    left: 0;
  }
  .nav-tabs .prev:after {
    content: "|";
    display: block;
    height: 36px;
    width: 1px;
    line-height: 36px;
    font-size: 12px;
    position: absolute;
    top: 0;
    right: -1px;
    color: #EDF0F4;
  }
  .nav-tabs .next {
    right: 42px;
  }
  .nav-tabs .prev .iconfont,
  .nav-tabs .next .iconfont {
    font-size: 12px;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -8px;
    margin-left: -8px;
    color: #9aabb8;
  }
  .nav-tabs > .el-dropdown {
    position: absolute;
    top: 0;
    right: 16px;
    margin-top: -8px;
    width: 16px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    margin: 0;
  }
  .nav-tabs > .el-dropdown:hover .el-dropdown-link.el-dropdown-selfdefine>i.saas {
    color: #0C9AFF;
  }
  .nav-tabs > .el-dropdown > .el-dropdown-link > .iconfont {
    color: #9aabb8;
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -8px;
    margin-left: -6px;
  }
  .el-dropdown-menu.el-popper {
    background: #fefefe;
    border: 1px solid #e8eff4;
    box-shadow: 0 0 8px 0 rgba(33, 41, 50, 0.06);
    border-radius: 6px 6px 6px 6px;
    top: 75px;
    width: 110px;
    height: 125px;
  }
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item {
    line-height: 32px;
    height: 32px;
    padding: 0 !important;
    padding-left: 17px !important;
  }
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item:focus,
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #f2f6fb;
  }
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item > .saas {
    vertical-align: middle;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
  }
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item:not(:hover) > .saas{
    color: #34495e;
  }
  .el-dropdown-menu.el-popper > .el-dropdown-menu__item > span {
    vertical-align: top;
    font-family: "PingFangSC-Regular";
    font-size: 12px;
    color: #34495e;
    padding-left: 8px;
  }
</style>

