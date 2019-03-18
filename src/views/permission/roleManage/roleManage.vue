<style lang="less" scoped>
  @import "./roleManage.less";
</style>
<template>
  <div class="role-manage-container">

    <div class='head'>
      <div class="opt">
        <span @click="expandAll" class="saas iconfont saas-expand-all">展开</span>
        <span @click="shrinkAll" class="saas iconfont saas-shrink-all">关闭</span>
        <span @click="reload" class="saas iconfont saas-header-refresh">刷新</span>
      </div>
      <el-button v-if="auth['moduleAuth_save']" class='add-btn' @click="addRole">
        <span class="saas iconfont saas-button-add"></span>
        新增
      </el-button>
    </div>

    <div class='main'>
      <div class="table tzx-table-container">

        <el-table :data="flattenRolesData" highlight-current-row @row-dblclick='handleDbClick' empty-text=" ">
          <el-table-column type="index" :index="indexMethod" />

          <el-table-column  min-width="180px" label="角色名称">
            <template slot-scope="scope">
              <!-- 添加缩进 -->
              <span v-for="(index) in scope.row.spaceLevel" :key="index" class="space"></span>

              <!-- 当前未展开，点击展开 -->
              <span @click="expandChildren(scope.row)" v-if="scope.row.iconType === 'Folder' && !scope.row.expand" class="saas iconfont saas-shrink-all"></span>
              <!-- 当前已展开，点击缩起 -->
              <span @click="shrinkChildren(scope.row)" v-if="scope.row.iconType === 'Folder' && scope.row.expand" class="saas iconfont saas-expand-all"></span>
              <!-- 文件类型 -->
              <span v-if="scope.row.iconType === 'File'" class="saas iconfont saas-aside-chargeaccount"></span>

              {{ scope.row.roleName }}
            </template>
          </el-table-column>

          <el-table-column min-width="90px" label="状态"
              prop="tag"
              :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '0' }]"
              :filter-method="filterValidState"
              :filter-multiple="false"
              filter-placement="bottom-start">
              <template slot-scope="scope">
                <el-tag v-if='scope.row.state === "1"' type="success">有效</el-tag>
                <el-tag v-else type="danger">无效</el-tag>
              </template>
            </el-table-column>

            <el-table-column min-width="90px" label="角色人员">
              <template slot-scope="scope">
                <!-- <el-popover trigger="hover" placement="top" v-if="scope.row.role_emp_num > 0">
                  <div>点击查看人员列表</div>
                  <div slot="reference">
                    <a href="#" @click.prevent="handleRoleStaffList(scope.row)">{{scope.row.role_emp_num}}人</a>
                  </div>
                </el-popover> -->
                <el-tooltip placement="top" effect="light" popper-class="common-popper" :enterable='false' v-if="scope.row.role_emp_num > 0">
                  <div slot="content">点击查看人员列表</div>
                  <a href="#" @click.prevent="handleRoleStaffList(scope.row)">{{scope.row.role_emp_num}}人</a>
                </el-tooltip>
                <p v-else>0人</p>
              </template>
            </el-table-column>
            <el-table-column min-width="90px" prop='createPerson' label="创建人"></el-table-column>
            <el-table-column min-width="90px" label="创建时间">
              <template slot-scope="scope">
                <div>{{scope.row.createDate | dateFilter('2', 'YYYY-MM-DD')}}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="90px" fixed="right" label="操作" width="147" align='center' class-name="opt"
              v-if="auth['moduleAuth_update'] || auth['moduleAuth_stopOrstart'] || auth['moduleAuth_del'] || auth['moduleAuth_fpqx']"
              >
              <template slot-scope="scope" style='text-align:left;'>
                <el-button v-if="auth['moduleAuth_update']" type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
                <el-button v-if="auth['moduleAuth_stopOrstart'] && scope.row.state === '1'" type="text" size="small" @click="setState(scope.row, '0')">停用</el-button>
                <el-button v-else-if="auth['moduleAuth_stopOrstart'] && scope.row.state === '0'" type="text" size="small" @click="setState(scope.row, '1')">启用</el-button>
                <el-button v-if="auth['moduleAuth_del'] && scope.row.state === '0'" type="text" size="small" @click="deleteRole(scope.row)">删除</el-button>
                <el-button v-else-if="auth['moduleAuth_fpqx'] && scope.row.state === '1'" type="text" size="small" @click="handleAssignPermissions(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>

      </div>
    </div>

    <!-- 新增和编辑 -->
    <editRoleManage v-if="showEditRoleManage" :showEditRoleManage="showEditRoleManage" :role="role" v-on:close="closeEditRoleManage"></editRoleManage>
    <!-- 显示角色详情 -->
    <roleDetails v-if="showRoleDetails" :showRoleDetails="showRoleDetails" :role="role" v-on:close="closeRoleDetails"></roleDetails>
    <!-- 显示角色人员列表 -->
    <roleStaffList v-if="showRoleStaffList" :showRoleStaffList="showRoleStaffList" :role="role" v-on:close="closeRoleStaffList"></roleStaffList>

  </div>
</template>
<script>
  import '../../../assets/less/tzx-table-pagination.css'
  import editRoleManage from './children/editRoleManage.vue'
  import roleDetails from './children/roleDetails.vue'
  import assignPermissions from './children/assignPermissions.vue'
  import roleStaffList from './children/roleStaffList.vue'
  import EventBus from '../../../utils/EventBus.js'
  export default {
    created () {
      // 获取权限
      this.getAuth()
      if (!this.auth) return
      //
      // ajax请求获取所有角色数据
      this.initAjax()
      //
      /*
      // 假数据
      var result = {
        status: 200,
        msg: 'ok',
        data: [
          {
            id: 1,
            roleLevel: 0,
            roleName: 'IT管理员',
            state: '1',
            role_emp_num: 0,
            remark: '',
            createPerson: 'system',
            createDate: '1318781876406',
            uplevelRoleId: 0,
            uplevelRoleName: '',
            children: []
          },
          {
            id: 2,
            roleLevel: 0,
            roleName: '市场总监',
            state: '1',
            role_emp_num: 32,
            remark: '',
            createPerson: 'system',
            createDate: '1318781876406',
            uplevelRoleId: 0,
            uplevelRoleName: '',
            children: []
          },
          {
            id: 3,
            roleLevel: 0,
            roleName: '店长',
            state: '1',
            role_emp_num: 32,
            remark: '',
            createPerson: 'system',
            createDate: '1318781876406',
            uplevelRoleId: 0,
            uplevelRoleName: '',
            children: [
              {
                id: 4,
                roleLevel: 1,
                roleName: '收银员',
                state: '1',
                role_emp_num: 32,
                remark: '',
                createPerson: 'system',
                createDate: '1318781876406',
                uplevelRoleId: 3,
                uplevelRoleName: '',
                children: [
                  {
                    id: 14,
                    roleLevel: 2,
                    roleName: '收银员2',
                    state: '1',
                    role_emp_num: 32,
                    remark: '',
                    createPerson: 'admin',
                    createDate: '1318781876406',
                    uplevelRoleId: 4,
                    uplevelRoleName: '',
                    children: []
                  },
                  {
                    id: 22,
                    roleLevel: 2,
                    roleName: '操作员',
                    state: '1',
                    role_emp_num: 32,
                    remark: '',
                    createPerson: 'admin',
                    createDate: '1318781876406',
                    uplevelRoleId: 4,
                    uplevelRoleName: '',
                    children: [
                      {
                        id: 23,
                        roleLevel: 3,
                        roleName: '收银员跟班',
                        state: '1',
                        role_emp_num: 32,
                        remark: '',
                        createPerson: 'admin',
                        createDate: '1318781876406',
                        uplevelRoleId: 22,
                        uplevelRoleName: '',
                        children: []
                      }
                    ]
                  },
                  {
                    id: 27,
                    roleLevel: 2,
                    roleName: '999',
                    state: '1',
                    role_emp_num: 32,
                    remark: '',
                    createPerson: 'admin',
                    createDate: '1318781876406',
                    uplevelRoleId: 4,
                    uplevelRoleName: '',
                    children: []
                  },
                  {
                    id: 36,
                    roleLevel: 2,
                    roleName: '斤斤计较',
                    state: '0',
                    role_emp_num: 32,
                    remark: '',
                    createPerson: 'admin',
                    createDate: '1318781876406',
                    uplevelRoleId: 4,
                    uplevelRoleName: '',
                    children: []
                  }
                ]
              },
              {
                id: 5,
                roleLevel: 1,
                roleName: '库管',
                state: '1',
                role_emp_num: 32,
                remark: '',
                createPerson: 'system',
                createDate: '1318781876406',
                uplevelRoleId: 3,
                uplevelRoleName: '',
                children: []
              },
              {
                id: 6,
                roleLevel: 1,
                roleName: '服务员',
                state: '1',
                role_emp_num: 32,
                remark: '',
                createPerson: 'system',
                createDate: '1318781876406',
                uplevelRoleId: 3,
                uplevelRoleName: '',
                children: []
              },
              {
                id: 21,
                roleLevel: 1,
                roleName: '门店店长',
                state: '1',
                role_emp_num: 32,
                remark: '',
                createPerson: 'admin',
                createDate: '1318781876406',
                uplevelRoleId: 3,
                uplevelRoleName: '',
                children: []
              },
              {
                id: 28,
                roleLevel: 1,
                roleName: '员工',
                state: '1',
                role_emp_num: 32,
                remark: '',
                createPerson: 'admin',
                createDate: '1318781876406',
                uplevelRoleId: 3,
                uplevelRoleName: '',
                children: []
              }
            ]
          },
          {
            id: 7,
            roleLevel: 0,
            roleName: '实施专用',
            state: '1',
            role_emp_num: 32,
            remark: '',
            createPerson: 'system',
            createDate: '1318781876406',
            uplevelRoleId: 0,
            uplevelRoleName: '',
            children: []
          }
        ]
      }
      // 初始化数据
      this.initData(result.data) // result.data []  空数据检测
      */
      //
      // 监听重新加载的时机
      EventBus.$on('reload', () => {
        this.reload()
      })
      //
      // 监听打开编辑角色
      EventBus.$on('openEditRoleManage', (role) => {
        this.editRole(role)
      })
      // 监听打开分配权限
      EventBus.$on('openHandleAssignPermissions', (role) => {
        this.handleAssignPermissions(role)
      })
      // 监听打开角色人员列表
      EventBus.$on('openRoleStaffList', (role) => {
        this.handleRoleStaffList(role)
      })
    },
    data () {
      return {
        // 权限对象
        auth: null,
        //
        showEditRoleManage: false, // 显示新增/编辑
        showRoleDetails: false, // 显示角色详情
        showRoleStaffList: false, // 显示角色人员列表
        //
        rolesData: [], // 角色元数据数组
        flattenRolesData: [], // 平坦角色数据数组
        //
        role: null, // 只有编辑的时候有值  // 查看角色人员列表的时候也使用 // 查看角色详情
        //
        allChildrenLevelStopedState: true, // 所有子级的停用状态 // 默认都是停用的
        allChildrenLevelRoleEmpNum: 0 // 所有子级角色人员数量 // 默认都没有子级
      }
    },
    methods: {
      //
      getAuth () {
        this.auth = this.authorityMap[this.$route.path]
      },
      //
      indexMethod (index) {
        return index * 1
      },
      handleData () { // 一级处理
        for (let i = 0; i < this.rolesData.length; i++) {
          let role = this.rolesData[i]
          this.$set(role, 'expand', false) // 未展开
          this.$set(role, 'spaceLevel', 0) // 没缩进
          this.$set(role, 'show', true) // 显示
          if (role.children && role.children.length > 0) {
            this.$set(role, 'iconType', 'Folder') // 文件夹
            this.dgHandleChildren(role.children, role.spaceLevel + 1)
          } else {
            this.$set(role, 'iconType', 'File') // 文件
          }
        }
      },
      dgHandleChildren (roles, spaceLevel) { // 其他级递归处理
        for (let j = 0; j < roles.length; j++) {
          let childRole = roles[j]
          this.$set(childRole, 'expand', false) // childRole.expand = false
          this.$set(childRole, 'spaceLevel', spaceLevel)  // childRole.spaceLevel = spaceLevel
          this.$set(childRole, 'show', false) // childRole.show = false
          if (childRole.children && childRole.children.length > 0) {
            this.$set(childRole, 'iconType', 'Folder') // childRole.iconType = 'Folder' // 文件夹
            this.dgHandleChildren(childRole.children, childRole.spaceLevel + 1)
          } else {
            this.$set(childRole, 'iconType', 'File') // childRole.iconType = 'File' // 文件
          }
        }
      },
      flattenDeep (roles) { // 深度平坦一个嵌套的数组 // 只要show = true的
        if (roles && roles.length > 0) {
          for (let i = 0; i < roles.length; i++) {
            let tmpRole = roles[i]
            if (tmpRole.show) {
              this.flattenRolesData.push(tmpRole)
            }
            this.flattenDeep(tmpRole.children)
          }
        }
      },
      initData (data) { // 初始化数据
        this.rolesData = data // 获取数据
        this.handleData() // 处理数据
        this.flattenDeep(this.rolesData) // 深度平坦一个嵌套的数组
      },
      dgFindRole (roles, role, bool) { // 递归查找角色，并对该角色以及该角色的孩子以及孙子进行修改
        if (roles && roles.length > 0) {
          for (let i = 0; i < roles.length; i++) {
            let tmpRole = roles[i]
            if (tmpRole.id === role.id) { // 找到了这个角色 // 修改该角色元数据，以及孩子孙子的元数据
              tmpRole.show = true // 自己始终先显示
              tmpRole.expand = bool // 自己先展开/自己先收起
              for (let j = 0; j < tmpRole.children.length; j++) {
                let childRole = tmpRole.children[j]
                childRole.show = bool // 孩子可显示/不显示
                childRole.expand = false // 孩子始终不展开
                this.dgFindGrandson(childRole.children, false) // 孙子始终不显示，始终不展开
              }
              break
            }
            this.dgFindRole(tmpRole.children, role, bool)
          }
        }
      },
      dgFindGrandson (childrenRoles, bool) { // 递归查找孙子
        if (childrenRoles && childrenRoles.length > 0) {
          for (let i = 0; i < childrenRoles.length; i++) {
            let grandsonRole = childrenRoles[i]
            grandsonRole.expand = bool
            grandsonRole.show = bool
            this.dgFindGrandson(grandsonRole.children, bool)
          }
        }
      },
      expandChildren (role) { // 展开孩子
        this.dgFindRole(this.rolesData, role, true) // 递归查找角色，修改元数据
        this.flattenRolesData = [] // 重置平坦数组
        this.flattenDeep(this.rolesData) // 设置平坦数据
      },
      shrinkChildren (role) { // 缩起孩子
        this.dgFindRole(this.rolesData, role, false) // 递归查找角色，修改元数据
        this.flattenRolesData = [] // 重置平坦数组
        this.flattenDeep(this.rolesData) // 设置平坦数据
      },
      shrinkAll () { // 缩起所有
        for (let i = 0; i < this.rolesData.length; i++) {
          let role = this.rolesData[i]
          role.expand = false
          role.show = true
          if (role.children && role.children.length > 0) {
            this.dgShrinkAllChildren(role.children)
          }
        }
        this.flattenRolesData = []
        this.flattenDeep(this.rolesData)
      },
      dgShrinkAllChildren (roles) {
        for (let j = 0; j < roles.length; j++) {
          let childRole = roles[j]
          childRole.expand = false
          childRole.show = false
          if (childRole.children && childRole.children.length > 0) {
            this.dgShrinkAllChildren(childRole.children)
          }
        }
      },
      expandAll () { // 展开所有
        for (let i = 0; i < this.rolesData.length; i++) {
          let role = this.rolesData[i]
          role.expand = false
          role.show = true
          if (role.children && role.children.length > 0) {
            role.expand = true
            this.dgExpandAllChildren(role.children)
          }
        }
        this.flattenRolesData = []
        this.flattenDeep(this.rolesData)
      },
      dgExpandAllChildren (roles) {
        for (let j = 0; j < roles.length; j++) {
          let childRole = roles[j]
          childRole.expand = false
          childRole.show = true
          if (childRole.children && childRole.children.length > 0) {
            childRole.expand = true
            this.dgExpandAllChildren(childRole.children)
          }
        }
      },
      initAjax () {
        this.$http
          .post('/api/role/roles/loadRoles', {})
          .then(res => {
            if (res.data.code === '0') { // 数据响应成功
              // this.dataFactory(res.data.data) // 数据加工
              // 初始化数据
              this.rolesData = []
              this.flattenRolesData = []
              this.initData(res.data.data)
            } else { // 数据响应失败
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => { // 响应错误
            this.$message({ type: 'error', message: err.msg })
          })
      },
      setStateAjax (role, state) { // 设置角色状态请求
        this.$http
          .post('/api/role/roles/setRoleState', {roleId: role.id, state: state})
          .then(res => {
            if (res.data.code === '0') { // 数据响应成功
              role.state = state // 设置角色状态
              this.$message({ type: 'success', message: res.data.msg })
            } else { // 数据响应失败
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => { // 响应错误
            this.$message({ type: 'error', message: err.msg })
          })
      },
      deleteAjax (role) { // 删除角色请求
        this.$http
          .post('/api/role/roles/delRoles', { roleId: role.id })
          .then(res => {
            if (res.data.code === '-1') { // 不能删除
              const h = this.$createElement
              this.$msgbox({
                title: '',
                type: 'info',
                message: h('div', null, [ h('p', null, '此角色已被如下人员使用，不能删除') ]),
                confirmButtonText: '知道了',
                confirmButtonClass: 'saasbtn saasbtn-default',
                showClose: false
              })
            } else { // 可以删除
              const h = this.$createElement
              this.$msgbox({
                title: '',
                type: 'warning',
                message: h('div', null, [ h('span', null, '您确认要删除此角色？') ]),
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定'
              })
              .then(action => {
                this.$http.post('/api/role/roles/delRoles', { roleId: role.id, type: 'T' })
                  .then(res => {
                    if (res.data.code === '0') { // 删除成功
                      this.$message({ type: 'success', message: res.data.msg })
                      //
                      // 删除成功之后，重新load
                      this.reload()
                      //
                    } else { // 删除失败
                      this.$message({ type: 'error', message: res.data.msg })
                    }
                  })
              })
              .catch(cancle => {})
            }
          })
          .catch(err => { // 响应错误
            this.$message({ type: 'error', message: err.msg })
          })
      },
      reload () { // 刷新，重新加载
        this.initAjax()
      },
      filterValidState (value, row) { // 有效/无效状态过滤
        return row.state === value
      },
      handleAssignPermissions (row) { // 路由到分配权限页面
        this.$router.push({name: 'assignPermissions', query: { roleId: row.id, roleName: row.roleName }})
      },
      closeEditRoleManage () { // 关闭新增/编辑窗口
        this.showEditRoleManage = false
      },
      addRole () { // 新增角色
        this.role = null
        this.showEditRoleManage = true
      },
      editRole (role) {  // 编辑角色
        this.role = role
        this.showEditRoleManage = true
      },
      setState (role, state) { // 设置启用/停用状态
        // debugger
        // 检测状态之前，初始化状态
        this.allChildrenLevelStopedState = true
        this.allChildrenLevelRoleEmpNum = 0
        //
        this.checkAllChildrenLevelStopedState(role) // 检测状态
        this.checkAllChildrenLevelRoleEmpNum(role) // 检测角色数量
        //
        // 修改bug
        if (state === '0') { // 停用
          if (this.allChildrenLevelStopedState && this.allChildrenLevelRoleEmpNum === 0 && role.role_emp_num === 0) { // 停用条件：所有孩子都停用，所有孩子都没有角色人员，子级没有角色人员
            this.setStateAjax(role, state)
          } else { // 否则不能停用
            const h = this.$createElement
            this.$msgbox({
              title: '',
              type: 'error',
              message: h('div', null, [ h('p', null, '存在有效下级，不能停用') ]),
              confirmButtonText: '确定',
              showClose: false
            })
          }
        } else if (state === '1') { // 启用
          this.setStateAjax(role, state)
        }
      },
      // 停用：
      // 1. 子级必须全部都是停用状态
      // 2. 子级必须全部都没有角色人员使用
      // 3. 当前角色也没有角色人员使用
      checkAllChildrenLevelStopedState (role) { // 检测所有子级的停用状态
        if (role.children && role.children.length > 0) {
          for (let i = 0; i < role.children.length; i++) {
            let childRole = role.children[i]
            if (childRole.state === '1') {
              this.allChildrenLevelStopedState = false
              break
            }
            this.checkAllChildrenLevelStopedState(childRole)
          }
        }
      },
      checkAllChildrenLevelRoleEmpNum (role) { // 检测所有子级的角色人员数量
        if (role.children && role.children.length > 0) {
          for (let i = 0; i < role.children.length; i++) {
            let childRole = role.children[i]
            if (childRole.role_emp_num !== 0) {
              this.allChildrenLevelRoleEmpNum = childRole.role_emp_num
              break
            }
            this.checkAllChildrenLevelRoleEmpNum(childRole)
          }
        }
      },
      // 删除：
      // 1. 当前角色没有孩子
      // 2. 当前角色没有角色人员使用（需要发起ajax请求，响应回来引用的角色人员的名字）
      // 3. 当前角色是停用状态（可以忽略，因为只有停用之后才会显示删除按钮）
      deleteRole (role) {
        if (role.children && role.children.length > 0) { // 不能删除
          const h = this.$createElement
          this.$msgbox({
            title: '',
            type: 'error',
            message: h('div', null, [ h('p', null, '存在有效下级，不能删除') ]),
            confirmButtonText: '确定',
            showClose: false
          })
        } else {
          this.deleteAjax(role)
        }
      },
      // 关闭角色详情
      closeRoleDetails () {
        this.showRoleDetails = false
      },
      handleDbClick (row) { // 处理双击行，显示角色详情
        // this.roleId = row.id
        this.role = row
        this.showRoleDetails = true
      },
      handleRoleStaffList (row) { // 显示角色人员列表
        this.role = row
        this.showRoleStaffList = true
      },
      closeRoleStaffList () { // 关闭角色人员列表
        this.showRoleStaffList = false
      }
    },
    computed: {
      authorityMap () {
        return this.$store.getters.getAuthorityMap
      }
    },
    components: {
      'editRoleManage': editRoleManage,
      'roleDetails': roleDetails,
      'assignPermissions': assignPermissions,
      'roleStaffList': roleStaffList
    }
  }
</script>
