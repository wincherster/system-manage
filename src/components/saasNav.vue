<template>
  <div class='nav' id="saasnav">
    <div v-if='!isCollapse' class='toggle toggle-h' @click='isCollapse=!isCollapse'>
      <img src="../assets/images/button.png" alt="">
    </div>
    <div v-else class='toggle toggle-v' @click='isCollapse=!isCollapse'>
      <img src="../assets/images/button.png" alt="">
    </div>
    <h1 v-if='!isCollapse' class='logo logo-h'>天子星云餐饮平台</h1>
    <h1 v-else class='logo logo-v'>天子星</h1>

    <el-menu class='el-menu-vertical-demo' :collapse='isCollapse' unique-opened text-color="#8C959B"
             active-text-color="#fff"
             menu-trigger="click">
      <el-submenu :index='navItem1.code' v-for='(navItem1, index) in navData' :key='navItem1.code' v-if="navItem1.has">
        <template slot='title' v-if='!isCollapse'>
          <i class='saas' :class='navItem1.icon'></i>
          <span slot='title'>{{navItem1.title}}</span>
        </template>
        <template slot='title' v-else>
          <i class='saas' :class='navItem1.icon'></i>
          <span slot='title'>{{navItem1.toggleTitle}}</span>
        </template>
        <el-menu-item v-if='!navItem2.children && navItem2.has' :index='navItem2.code'
                      v-for='(navItem2, index) in navItem1.children'
                      :key='navItem2.code'>
          <a @click.prevent='toLink(navItem2)'>{{navItem2.title}}</a>
        </el-menu-item>
        <el-submenu v-else-if="navItem2.children && navItem2.has" :index='navItem2.code'>
          <span slot='title'>{{navItem2.title}}</span>
          <el-menu-item :index='navItem3.code' v-for='(navItem3, index) in navItem2.children' :key='navItem3.code'
                        v-if="navItem3.has">
            <a @click.prevent='toLink(navItem3)'>{{navItem3.title}}</a>
          </el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        navData: [
          {
            title: '组织机构管理',
            toggleTitle: '机构',
            level: 1,
            code: '101002',
            icon: 'saas-organ-manage',
            has: false,
            children: [
              {
                title: '品牌管理',
                router: '/brandManage',
                level: 2,
                has: false,
                code: '101002001'
              },
              {
                title: '注册法人管理',
                router: '/legalManage',
                has: false,
                level: 2,
                code: '101002003'
              },
              {
                title: '价格体系管理',
                router: '/priceManage',
                has: false,
                level: 2,
                code: '101002004'
              },
              {
                title: '机构管理',
                router: '/organizaManage',
                has: false,
                level: 2,
                code: '101002005'
              },
              {
                title: '第三方支付设置',
                router: '/thirdSetup',
                has: false,
                level: 2,
                code: '101002006'
              }
            ]
          },
          {
            title: '人员权限管理',
            toggleTitle: '权限',
            level: 1,
            code: '101003',
            icon: 'saas-person-manage',
            has: false,
            children: [
              {
                title: '角色管理',
                router: '/roleManage',
                has: false,
                level: 2,
                code: '101003001'
              },
              {
                title: '人员管理',
                router: '/personManage',
                has: false,
                level: 2,
                code: '101003002'
              }
            ]
          },
          {
            title: '系统设置',
            toggleTitle: '系统',
            level: 1,
            has: false,
            code: '101004',
            icon: 'saas-aside-basicsetting',
            children: [
              {
                title: '系统公告',
                router: '/systemNotice',
                has: false,
                level: 2,
                code: '101004001'
              },
              {
                title: '菜系维护',
                router: '/cuisineMaint',
                has: false,
                level: 2,
                code: '101004002'
              },
              {
                title: '人员职位',
                router: '/personPosition',
                has: false,
                level: 2,
                code: '101004003'
              },
              {
                title: '高级设置',
                has: false,
                level: 2,
                code: '101004004',
                children: [
                  {
                    title: '店面基础信息设置',
                    router: '/storeSetting',
                    has: false,
                    level: 2,
                    code: '101004004001'
                  },
                  {
                    title: '编码规则设置',
                    router: '/codeRoleSetting',
                    has: false,
                    level: 2,
                    code: '101004004002'
                  },
                  {
                    title: '系统字典',
                    router: '/systemDictionary',
                    has: false,
                    level: 2,
                    code: '101004004003'
                  },
                  {
                    title: '省市地区',
                    router: '/provice',
                    has: false,
                    level: 2,
                    code: '101004004004'
                  },
                  {
                    title: '定时任务设置',
                    router: '/timeTask',
                    has: false,
                    level: 2,
                    code: '101004004005'
                  }
                ]
              }
            ]
          }
        ],
        isCollapse: false,
        menus: []
      }
    },
    methods: {
      toLink (navItem) {
        this.$store.dispatch('addNavTab', navItem)
        this.$router.push({path: navItem.router})
      },
      getMenu () {
        for (let i = 0; i < this.authority.length; i++) {
          let item = this.authority[i]
          this.menus.push(item.modulId)
        }
        this.makeTree(this.navData)
      },
      makeTree (animals) {
        let self = this
        animals.forEach(c => {
          self.menus.forEach(d => {
            if (d === c.code) {
              c.has = true
            }
          })
          if (c.children) {
            self.makeTree(c.children)
          }
        })
      }
    },
    created () {
      if (this.authority && this.authority.length > 0) {
        this.getMenu()
      }
    },
    watch: {
      authority () {
        this.getMenu()
      }
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      }
    }
  }
</script>
<style lang="less">
  #saasnav {
    position: relative;
    .toggle {
      width: 22px;
      height: 21px;
      position: absolute;
      right: -40px;
      top: 13px;
      z-index: 10;
      &.toggle-v {
        img {
          transform: rotate(90deg);
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &.toggle-h {
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    h1.logo {
      height: 60px;
      font-size: 14px;
      color: #FFFFFF;
      line-height: 60px;
      text-align: center;
      &.logo-v {
        width: 70px;
      }
      &.logo-h {
        width: 160px;
      }
    }
    .el-menu.el-menu-vertical-demo:not(.el-menu--collapse) {
      * {
        font-size: 13px;
        outline: 0;
        box-sizing: border-box;
      }
      border: none;
      background-color: #262626;
      width: 160px;
      .el-submenu {
        background-color: #262626;
        .el-submenu__title {
          height: 34px;
          line-height: 34px;
          padding-left: 14px !important;
          border-left: 3px solid transparent;
          i.saas {
            margin-right: 8px;
          }
          i.el-submenu__icon-arrow.el-icon-arrow-down {
            transform: rotate(-90deg);
          }
          &:hover {
            background: rgba(12, 154, 255, .15);
            border-left-color: #0C9AFF;
            > i.saas {
              color: #fff;
            }
            > span {
              color: #fff !important;
            }
            > i.el-submenu__icon-arrow.el-icon-arrow-down {
              color: #fff !important;
            }
          }
        }
        ul.el-menu {
          background-color: #000;
          li.el-menu-item {
            padding-left: 41px !important;
            border-left: 3px solid transparent;
            height: 34px;
            > a {
              color: #8C959B;
              display: block;
              width: 100%;
              height: 100%;
              line-height: 34px;
            }
          }
          li.el-submenu {
            .el-submenu__title {
              padding-left: 41px !important;
              > span {
                color: #8C959B;
              }
              > i.el-submenu__icon-arrow.el-icon-arrow-down {
                transform: rotate(-90deg);
                color: #8C959B;
              }
            }
            > a {
              color: #8C959B;
            }
          }
        }
        &.is-opened {
          background-color: #000;
          .el-submenu__title {
            > i.saas {
              color: #fff;
            }
            > span {
              color: #fff;
            }
            > i.el-submenu__icon-arrow.el-icon-arrow-down {
              transform: rotate(0);
              color: #fff;
            }
          }
          ul.el-menu {
            background-color: #000;
            li.el-menu-item {
              padding-left: 41px !important;
              border-left: 3px solid transparent;
              height: 34px;
              > a {
                color: #8C959B;
              }
              &:hover, &:active, &.is-active {
                outline: 0;
                background: rgba(12, 154, 255, .15);
                border-left-color: #0C9AFF;
                > a {
                  color: #fff;
                }
              }
            }
            li.el-submenu {
              background-color: #000;
              .el-submenu__title {
                padding-left: 41px !important;
                > span {
                  color: #8C959B;
                }
                > i.el-submenu__icon-arrow.el-icon-arrow-down {
                  transform: rotate(-90deg);
                  color: #8C959B;
                }
              }
              > a {
                color: #8C959B;
              }
              .el-menu-item {
                padding-left: 47px !important;
              }
            }
            li.el-submenu.is-opened {
              background-color: #000;
              .el-submenu__title {
                padding-left: 41px !important;
                > span {
                  color: #fff;
                }
                > i.el-submenu__icon-arrow.el-icon-arrow-down {
                  transform: rotate(0deg);
                  color: #fff;
                }
              }
              .el-menu-item {
                padding-left: 47px !important;
              }
            }
          }
        }
      }
    }
    .el-menu.el-menu-vertical-demo.el-menu--collapse {
      * {
        outline: 0;
        box-sizing: border-box;
      }
      border: none;
      background-color: #262626;
      width: 70px;
      li.el-submenu {
        height: 56px;
        .el-submenu__title {
          height: 100%;
          border: none;
          line-height: normal;
          padding: 13px 23px 11px 23px !important;
          text-align: center;
          &:hover {
            background: #151515;
            > i, span {
              color: #fff;
            }
          }
          > i.saas {
            font-size: 14px;
            margin: 0 auto;
          }
          > span {
            display: block;
            width: 100%;
            font-size: 12px;
            height: 12px;
            color: #8C959B;
            line-height: 12px;
            visibility: inherit;
            margin-top: 6px;
          }
        }
        ul.el-menu {
          background: #151515;
          margin: 0;
          border: none;
          width: 160px;
          border-radius: 0;
          > .el-menu-item {
            padding: 0 0 0 26px !important;
            width: 100%;
            min-width: 160px;
            height: 34px;
            &:hover {
              background: rgba(12, 154, 255, .15);
              > a {
                color: #fff;
              }
            }
            > a {
              font-size: 12px;
              color: #969B97;
              display: block;
              width: 100%;
              height: 100%;
              line-height: 34px;
            }
          }
          > li.el-submenu {
            width: 100%;
            min-width: 160px;
            > .el-submenu__title {
              text-align: left;
              padding: 0 20px 0 26px !important;
              > span {
                width: 100%;
                height: 100%;
                line-height: 56px;
                margin: 0;
              }
              &:hover {
                background: rgba(12, 154, 255, .15);
              }
            }
            > ul.el-menu {
              left: 0;
              top: 100%;
              border-radius: 0;
              box-shadow: none;
              > li.el-menu-item {
                padding-left: 32px !important;
              }
            }
            &.is-opened {
              > .el-submenu__title {
                > span {
                }
                > .el-submenu__icon-arrow.el-icon-arrow-right {
                  color: #fff;
                  transform: rotate(90deg);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
