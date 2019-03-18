<style lang="less" scoped>
  @import "./editRoleManage.less";
</style>
<template>
  <transition name="fade">
    <div class="edit-role-manage-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title">{{this.role ? "编辑角色" : "新增角色"}}</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="left" status-icon>
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入40个以内的汉字或字符" clearable @focus="isExist=false" @blur="form.roleName ? form.roleName = form.roleName.trim() : ''"></el-input>
            </el-form-item>
            <el-form-item label="上级角色:" prop="uplevelRoleId" class="tree-select">
              <el-input placeholder="请选择上级角色" :readonly="true" v-model="uplevelRoleName" @focus="showRoleTree = true" clearable></el-input>
              <transition name="el-zoom-in-top">
                  <div class="tree-cantainer" v-if="showRoleTree">
                    <el-tree
                      @node-click="handleNodeClick"
                      :data="roleTree"
                      default-expand-all
                      ref="tree"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </div>
              </transition>
            </el-form-item>
            <el-form-item label="备注:" prop="remark" class="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入400个以内的汉字或字符" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
            </el-form-item>
          </el-form>
          <div class="opt">
            <el-button @click="close()" class="kxBtn">取消</el-button>
            <el-button type="primary" @click="submit('form')" class="sxBtn" :disabled="!enabled" :class="{ 'disabledBtn': !enabled }" >确定</el-button>
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
      // 发送请求，获取角色树
      this.getRoleTreeAjax()

      /*
      // 假数据 // 查询出所有角色
      let result = [
        {
          children: [
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 47,
                  fid: '',
                  id: 89,
                  level: 1,
                  text: 'hong',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 47,
                  fid: '',
                  id: 91,
                  level: 1,
                  text: 'hongjiarui',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 47,
                  fid: '',
                  id: 97,
                  level: 1,
                  text: 'wangwang',
                  type: ''
                },
                {
                  children: [
                    {
                      children: [
                        {
                          children: [],
                          code: '',
                          fatherId: 99,
                          fid: '',
                          id: 100,
                          level: 3,
                          text: 'test21',
                          type: ''
                        }
                      ],
                      code: '',
                      fatherId: 98,
                      fid: '',
                      id: 99,
                      level: 2,
                      text: 'test11',
                      type: ''
                    }
                  ],
                  code: '',
                  fatherId: 47,
                  fid: '',
                  id: 98,
                  level: 1,
                  text: 'test01',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 47,
                  fid: '',
                  id: 102,
                  level: 1,
                  text: '123123123',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 47,
              level: 0,
              text: 'IT管理员',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 51,
              level: 0,
              text: 'suibiantia',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 52,
              level: 0,
              text: '系统管理1',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 53,
              level: 0,
              text: '人员管理角色',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 55,
                  fid: '',
                  id: 72,
                  level: 1,
                  text: '僚机',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 55,
                  fid: '',
                  id: 86,
                  level: 1,
                  text: 'xyxtest',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 55,
              level: 0,
              text: 'test',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 56,
                  fid: '',
                  id: 145,
                  level: 1,
                  text: '11',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 56,
              level: 0,
              text: '收银主管',
              type: ''
            },
            {
              children: [
                {
                  children: [
                    {
                      children: [],
                      code: '',
                      fatherId: 143,
                      fid: '',
                      id: 146,
                      level: 2,
                      text: '12212',
                      type: ''
                    }
                  ],
                  code: '',
                  fatherId: 57,
                  fid: '',
                  id: 143,
                  level: 1,
                  text: '角色啊 啊',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 57,
              level: 0,
              text: 'henry',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 58,
                  fid: '',
                  id: 144,
                  level: 1,
                  text: '新增角色',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 58,
                  fid: '',
                  id: 151,
                  level: 1,
                  text: '催催',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 58,
              level: 0,
              text: '库管bai',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 60,
              level: 0,
              text: '高健测试角色',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 61,
              level: 0,
              text: 'feng',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 62,
                  fid: '',
                  id: 153,
                  level: 1,
                  text: 'hhhhhhhhhhhhh',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 62,
              level: 0,
              text: '微信权限测试人员',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 63,
              level: 0,
              text: '全能',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 64,
                  fid: '',
                  id: 65,
                  level: 1,
                  text: '测试123',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 64,
                  fid: '',
                  id: 66,
                  level: 1,
                  text: '测试456',
                  type: ''
                },
                {
                  children: [],
                  code: '',
                  fatherId: 64,
                  fid: '',
                  id: 70,
                  level: 1,
                  text: 'liyuguo',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 64,
              level: 0,
              text: '测试',
              type: ''
            },
            {
              children: [
                {
                  children: [],
                  code: '',
                  fatherId: 67,
                  fid: '',
                  id: 68,
                  level: 1,
                  text: '打雪仗',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 67,
              level: 0,
              text: '打雪球123',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 69,
              level: 0,
              text: '534534543',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 71,
              level: 0,
              text: '肉机',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 83,
              level: 0,
              text: '163收银员',
              type: ''
            },
            {
              children: [
                {
                  children: [
                    {
                      children: [],
                      code: '',
                      fatherId: 96,
                      fid: '',
                      id: 152,
                      level: 2,
                      text: '水水水水',
                      type: ''
                    }
                  ],
                  code: '',
                  fatherId: 84,
                  fid: '',
                  id: 96,
                  level: 1,
                  text: '阿斯顿',
                  type: ''
                }
              ],
              code: '',
              fatherId: 0,
              fid: '',
              id: 84,
              level: 0,
              text: '猪猪1',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 85,
              level: 0,
              text: '123444',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 90,
              level: 0,
              text: '服务',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 92,
              level: 0,
              text: '新建test',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 94,
              level: 0,
              text: '1',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 95,
              level: 0,
              text: 'aaaaa',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 101,
              level: 0,
              text: '餐厅服务员',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 103,
              level: 0,
              text: '测试修改报表权限',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 104,
              level: 0,
              text: 'admin',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 109,
              level: 0,
              text: 'admin',
              type: ''
            },
            {
              children: [],
              code: '',
              fatherId: 0,
              fid: '',
              id: 110,
              level: 0,
              text: '测试正在',
              type: ''
            }
          ],
          code: '',
          fatherId: 0,
          fid: '',
          id: 0,
          level: -1,
          text: ' 基础角色类型',
          type: ''
        }
      ]
      this.roleTree = result
      */
      //
    },
    mounted () {
      if (this.showSlideRightBody) {
        this.showBody()
      }
    },
    props: ['role', 'showEditRoleManage'],
    data () {
      return {
        form: {
          id: null, // 角色ID，只有在编辑的时候有值
          roleName: '', // 新增角色名
          roleLevel: 0, // 新增角色的级别
          uplevelRoleId: '', // 新增角色的上级角色的ID
          remark: '', // 新增角色的备注
          state: '1', // 新增角色的可用状态
          type: '1' // 新增角色的类别
        },
        rules: {
          roleName: [
            { required: true, message: '请输入40个以内的汉字或字符', trigger: 'blur' },
            { min: 1, max: 40, message: '请输入40个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入40个以内的汉字或字符', trigger: 'change' },
            { validator: this.repeatValidator, trigger: 'change' }
          ],
          remark: [
            { min: 0, max: 400, message: '请输入400个以内的汉字或字符', trigger: 'blur' }
          ],
          uplevelRoleId: [
            { required: true, message: '请选择上级角色', trigger: 'change' }
          ]
        },
        uplevelRoleName: '',
        showRoleTree: false, // 是否显示角色树
        roleTree: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        showSlideRightBody: this.showEditRoleManage, // 是否显示侧滑窗口
        isExist: false // 校验角色名是否存在
      }
    },
    methods: {
      // 发起请求获取角色树
      getRoleTreeAjax () {
        this.$http
          .post('/api/role/roles/getRolesLevelCombotree')
          .then(res => {
            if (res.data.code === '0') {
              // console.log(res)
              this.roleTree = JSON.parse(res.data.data)
              // console.log(this.roleTree)

              // 编辑的时候初始化form
              if (this.role) {
                this.initForm()
              }
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      // 添加提交和编辑提交请求
      submitAjax () {
        this.$http
          .post('/api/role/roles/updateRoles', {form: this.form, m_ids: '', type: '1', tenentid: this.role ? this.role.tenancyId : 'hdl'})
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              this.close()
              //
              // 添加/编辑后通知父组件重新reload
              EventBus.$emit('reload')
              //
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      submit (form) { // 提交表单
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.submitAjax()
          }
        })
      },
      handleNodeClick (data) { // 处理角色树节点点击事件
        // debugger
        this.form.uplevelRoleId = data.id // 新创建的角色上级角色的ID就是点击的角色ID
        this.form.roleLevel = (+data.level) + 1 // 新创建的角色级别就是点击的角色的级别+1

        this.uplevelRoleName = data.text
        this.showRoleTree = false
      },
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      },
      checkIsExist (roleGroup) { // 递归校验
        for (let i = 0; i < roleGroup.length; i++) {
          let role = roleGroup[i]
          if (role.text === this.form.roleName) {
            this.isExist = true
          } else if (role.children && role.children.length > 0) {
            this.checkIsExist(role.children)
          }
        }
      },
      repeatValidator (rule, value, callback, source, options) { // 角色名重复校验器
        var errors = []
        this.isExist = false // 每次检测之前都重置标志位
        if (!this.role) { // 只有添加的时候才进行角色名称重复校验的功能
          // 检测名称重复
          this.checkIsExist(this.roleTree)
          if (this.isExist) {
            errors.push(new Error('角色名重复了'))
          }
        }
        callback(errors)
      },
      close: function () {
        this.$emit('close')
      },
      initForm () {
        // debugger
        // console.log(this.role)
        this.form.id = this.role.id
        this.form.roleName = this.role.roleName
        this.form.roleLevel = this.role.roleLevel
        this.form.uplevelRoleId = this.role.uplevelRoleId
        this.form.remark = this.role.remark
        this.form.state = this.role.state
        this.form.type = '1'
        //
        this.findUplevelRoleName(this.roleTree)
        // console.log(this.form)
      },
      findUplevelRoleName (roleGroup) { // 根据角色上级ID查询出上级角色的名称
        for (let i = 0; i < roleGroup.length; i++) {
          let role = roleGroup[i]
          if (role.id === this.role.uplevelRoleId) {
            this.uplevelRoleName = role.text
            return
          } else if (role.children && role.children.length > 0) {
            this.findUplevelRoleName(role.children)
          }
        }
      }
    },
    computed: {
      enabled () {
        return this.form.roleName && this.form.uplevelRoleId
      }
    }
  }
</script>
