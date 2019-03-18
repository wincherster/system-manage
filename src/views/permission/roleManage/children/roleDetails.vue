<style lang="less" scoped>
@import "./roleDetails.less";
</style>
<template>
  <transition name="fade">
    <div class="role-details-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title">角色详情</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="details-container">
            <p><span class="tag">角色名称:</span><span class="content">{{ roleDetails.roleName }}</span></p>
            <p><span class="tag">上级角色:</span><span class="content">{{ roleDetails.uplevelRoleName }}</span></p>
            <p><span class="tag">角色人员:</span><span class="content"><a href="#" @click.prevent="handleRoleStaffList" v-if="roleDetails.role_emp_num > 0">{{ roleDetails.role_emp_num }}人</a><span v-else>{{ roleDetails.role_emp_num }}人</span></span></p>
            <p><span class="tag">备注:</span><span class="content remark">{{ roleDetails.remark }}</span></p>
          </div>
          <div class="permissions-container">
            <h3 class="title">角色权限</h3>
            <div class="module-tabs">
              <el-tabs v-model="activeName" type="card" @tab-click="toLinkHash">
                <el-tab-pane v-for="(mod, index) in rolePermissionsTree" :key="index" :label="mod.moduleName" :name="'ID-'+mod.id" />
              </el-tabs>
            </div>
            <div class="module-permissions">
              <div :id="'ID-'+mod.id" class="module-tree" v-for="(mod) in rolePermissionsTree" :key="mod.id">
                <h3 class="title">{{mod.moduleName}}</h3>
                <el-tree
                  :data="mod.children"
                  default-expand-all
                  highlight-current
                  :props="defaultProps">
                </el-tree>
                <div class="split-line"></div>
              </div>
            </div>
          </div>
          <div class="opt">
            <el-button class="kxBtn" @click="close">返回</el-button>
            <el-button class="kxBtn" @click="editRole">编辑</el-button>
            <el-button type="primary" class="sxBtn" @click="handleAssignPermissions">分配权限</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../assets/less/tzx-slide-right-window.css'
  import EventBus from '../../../../utils/EventBus.js'
  export default {
    created () {
      /*
      // 假数据 角色详情
      let result1 = {
        code: '0',
        msg: '操作成功！',
        data: [
          {
            tenancyId: null,
            id: 97,
            roleName: 'wangwang',
            state: null,
            createPerson: null,
            createDate: null,
            roleLevel: null,
            uplevelRoleId: 47,
            remark: '我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊我是备注啊',
            role_emp_num: 32,
            uplevelRoleName: 'IT管理员dd',
            target: 0,
            children: null
          }
        ]
      }
      // 假数据 权限树
      let result2 = {
        code: '0',
        msg: '操作成功！',
        data: [
          [
            '2001',
            '2015',
            '6003',
            '6222',
            '6631',
            '6632'
          ],
          [
            {
              id: 2001,
              moduleName: '源数据管理',
              fatherModuleId: 0,
              moduleLevel: 1,
              auth: 1,
              target: 1,
              orderNum: null,
              children: [
                {
                  id: 2015,
                  moduleName: '微信后台设置',
                  fatherModuleId: 2001,
                  moduleLevel: 2,
                  auth: 1,
                  target: 1,
                  orderNum: null,
                  children: [
                    {
                      id: 6003,
                      moduleName: '微信营销管理',
                      fatherModuleId: 2015,
                      moduleLevel: 3,
                      auth: 1,
                      target: 1,
                      orderNum: null,
                      children: [
                        {
                          id: 6222,
                          moduleName: '活动管理',
                          fatherModuleId: 6003,
                          moduleLevel: 4,
                          auth: 1,
                          target: 1,
                          orderNum: null,
                          children: [
                            {
                              id: 6631,
                              moduleName: '商品设置',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 2,
                              children: [],
                              operation: []
                            },
                            {
                              id: 6632,
                              moduleName: '游戏列表',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 3,
                              children: [],
                              operation: []
                            }
                          ],
                          operation: []
                        }
                      ],
                      operation: []
                    }
                  ],
                  operation: []
                }
              ],
              operation: []
            },
            {
              id: 2002,
              moduleName: '系统设置',
              fatherModuleId: 0,
              moduleLevel: 1,
              auth: 1,
              target: 1,
              orderNum: null,
              children: [
                {
                  id: 2016,
                  moduleName: '微信后台设置2',
                  fatherModuleId: 2001,
                  moduleLevel: 2,
                  auth: 1,
                  target: 1,
                  orderNum: null,
                  children: [
                    {
                      id: 6006,
                      moduleName: '微信营销管理2',
                      fatherModuleId: 2015,
                      moduleLevel: 3,
                      auth: 1,
                      target: 1,
                      orderNum: null,
                      children: [
                        {
                          id: 6228,
                          moduleName: '活动管理2',
                          fatherModuleId: 6003,
                          moduleLevel: 4,
                          auth: 1,
                          target: 1,
                          orderNum: null,
                          children: [
                            {
                              id: 6639,
                              moduleName: '商品设置2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 2,
                              children: [],
                              operation: []
                            },
                            {
                              id: 6635,
                              moduleName: '游戏列表2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 3,
                              children: [],
                              operation: []
                            }
                          ],
                          operation: []
                        }
                      ],
                      operation: []
                    }
                  ],
                  operation: []
                }
              ],
              operation: []
            },
            {
              id: 2003,
              moduleName: '配送',
              fatherModuleId: 0,
              moduleLevel: 1,
              auth: 1,
              target: 1,
              orderNum: null,
              children: [
                {
                  id: 2036,
                  moduleName: '微信后台设置3',
                  fatherModuleId: 2003,
                  moduleLevel: 2,
                  auth: 1,
                  target: 1,
                  orderNum: null,
                  children: [
                    {
                      id: 6006,
                      moduleName: '微信营销管理3',
                      fatherModuleId: 2015,
                      moduleLevel: 3,
                      auth: 1,
                      target: 1,
                      orderNum: null,
                      children: [
                        {
                          id: 6228,
                          moduleName: '活动管理3',
                          fatherModuleId: 6003,
                          moduleLevel: 4,
                          auth: 1,
                          target: 1,
                          orderNum: null,
                          children: [
                            {
                              id: 6639,
                              moduleName: '商品设置4',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 2,
                              children: [],
                              operation: []
                            },
                            {
                              id: 6635,
                              moduleName: '游戏列表4',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 3,
                              children: [],
                              operation: []
                            }
                          ],
                          operation: []
                        }
                      ],
                      operation: []
                    }
                  ],
                  operation: []
                }
              ],
              operation: []
            },
            {
              id: 2004,
              moduleName: '前台设置',
              fatherModuleId: 0,
              moduleLevel: 1,
              auth: 1,
              target: 1,
              orderNum: null,
              children: [
                {
                  id: 2016,
                  moduleName: '微信后台设置2',
                  fatherModuleId: 2001,
                  moduleLevel: 2,
                  auth: 1,
                  target: 1,
                  orderNum: null,
                  children: [
                    {
                      id: 6006,
                      moduleName: '微信营销管理2',
                      fatherModuleId: 2015,
                      moduleLevel: 3,
                      auth: 1,
                      target: 1,
                      orderNum: null,
                      children: [
                        {
                          id: 6228,
                          moduleName: '活动管理2',
                          fatherModuleId: 6003,
                          moduleLevel: 4,
                          auth: 1,
                          target: 1,
                          orderNum: null,
                          children: [
                            {
                              id: 6639,
                              moduleName: '商品设置2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 2,
                              children: [],
                              operation: []
                            },
                            {
                              id: 6635,
                              moduleName: '游戏列表2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 3,
                              children: [],
                              operation: []
                            }
                          ],
                          operation: []
                        }
                      ],
                      operation: []
                    }
                  ],
                  operation: []
                }
              ],
              operation: []
            },
            {
              id: 2005,
              moduleName: 'CRM模块',
              fatherModuleId: 0,
              moduleLevel: 1,
              auth: 1,
              target: 1,
              orderNum: null,
              children: [
                {
                  id: 2016,
                  moduleName: '微信后台设置2',
                  fatherModuleId: 2001,
                  moduleLevel: 2,
                  auth: 1,
                  target: 1,
                  orderNum: null,
                  children: [
                    {
                      id: 6006,
                      moduleName: '微信营销管理2',
                      fatherModuleId: 2015,
                      moduleLevel: 3,
                      auth: 1,
                      target: 1,
                      orderNum: null,
                      children: [
                        {
                          id: 6228,
                          moduleName: '活动管理2',
                          fatherModuleId: 6003,
                          moduleLevel: 4,
                          auth: 1,
                          target: 1,
                          orderNum: null,
                          children: [
                            {
                              id: 6639,
                              moduleName: '商品设置2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 2,
                              children: [],
                              operation: []
                            },
                            {
                              id: 6635,
                              moduleName: '游戏列表2',
                              fatherModuleId: 6222,
                              moduleLevel: 5,
                              auth: 1,
                              target: 0,
                              orderNum: 3,
                              children: [],
                              operation: []
                            }
                          ],
                          operation: []
                        }
                      ],
                      operation: []
                    }
                  ],
                  operation: []
                }
              ],
              operation: []
            }
          ]
        ]
      }

      this.roleDetails = result1.data[0]
      this.rolePermissionsTree = result2.data[1]
      this.activeName = 'ID-' + result2.data[1][0].id
      console.log(this.activeName)
      */

      // 获取角色详情
      this.getRoleDetailAjax()

      // 获取角色权限树
      this.getRolePermissionsTreeAjax()

      // console.log(this.role, '<<<===>>')
    },
    mounted () {
      if (this.showSlideRightBody) {
        this.showBody()
      }
    },
    props: ['role', 'showRoleDetails'],
    data () {
      return {
        showSlideRightBody: this.showRoleDetails, // 是否显示侧滑窗口
        //
        roleDetails: {},
        rolePermissionsTree: [], // 角色拥有的所有权限树
        //
        activeName: '',
        defaultProps: {
          children: 'children',
          label: 'moduleName'
        }
      }
    },
    methods: {
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      },
      close: function () {
        this.$emit('close')
      },
      toLinkHash (tab) { // 锚点跳转
        // console.log(tab.name)
        document.querySelector(`#${tab.name}`).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      },
      getRoleDetailAjax () { // 根据角色ID获取角色详情
        this.$http
          .post('/api/role/roles/loadRoles', { roleId: this.role.id })
          .then(res => {
            if (res.data.code === '0') {
              this.roleDetails = res.data.data[0]
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      getRolePermissionsTreeAjax () { // 根据角色ID获取角色所拥有的权限
        this.$http
          .post('/api/role/roles/queryRoleModuleById', { roleId: this.role.id })
          .then(res => {
            if (res.data.code === '0') {
              this.rolePermissionsTree = res.data.data[1]
              if (this.rolePermissionsTree && this.rolePermissionsTree.length > 0) {
                // 初始化标签页
                this.activeName = 'ID-' + this.rolePermissionsTree[0].id
              }
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      editRole () {  // 编辑角色
        EventBus.$emit('openEditRoleManage', this.role)
        this.close()
      },
      handleAssignPermissions () { // 分配权限
        EventBus.$emit('openHandleAssignPermissions', this.role)
        this.close()
      },
      handleRoleStaffList () { // 角色人员列表
        EventBus.$emit('openRoleStaffList', this.role)
        this.close()
      }
    }
  }
</script>

