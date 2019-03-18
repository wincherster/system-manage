<style lang="less" scoped>
  @import "./editPersonManage.less";
</style>
<template>
  <div class="add-box" id="editPersonManage">
    <div class="add-header">
      <h3>{{this.$store.state.cacheData.empId > 0 ? '编辑' : '新增'}}人员</h3>
    </div>
    <div class="line"></div>
    <div class="add-body">
      <div class="add-main">
        <div class="form-container">
          <el-form :label-position="labelPosition" :model="form" :rules="rules" ref="form" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="账号" prop="empAccount">
                  <el-input v-model="form.empAccount" placeholder="请输入20个以内的数字或字符"
                            @blur="form.empAccount = form.empAccount.trim()"></el-input>
                </el-form-item>
                <el-form-item label="角色权限" prop="rolesId">
                  <el-select v-model="form.RoleAuthority" placeholder="请选择角色权限" popper-class="tree-select">
                    <el-option label="" value="" >
                      <el-tree :data="roleTree" :props="defaultProps" ref="RoleAuthority" node-key="id"
                               :expand-on-click-node="false"
                               default-expand-all @node-click="roleAuthorityTreeChange" highlight-current></el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="empName">
                  <el-input v-model="form.empName" placeholder="请输入20个以内的数字或字符"
                            @blur="form.empName = form.empName.trim()"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="form.sex" placeholder="请选择性别" popper-class="input-select">
                    <el-option label="男" value="0"></el-option>
                    <el-option label="女" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入有效手机号码"
                            @blur="form.phone = form.phone.trim()"></el-input>
                </el-form-item>
                <el-form-item label="学历">
                  <el-select v-model="form.education" placeholder="请选择学历" popper-class="input-select">
                    <el-option :label="education.text" :value="education.id" v-for="education in educations" :key="education.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" placeholder="请输入数字,字母,符号" type="password"
                            @blur="form.password = form.password.trim()"></el-input>
                  <el-button type="primary" @click="resetpwd" class="reset">重置密码</el-button>
                </el-form-item>
                <el-form-item label="适用机构" prop="storeId">
                  <el-select v-model="form.organName" placeholder="请选择适用机构" popper-class="tree-select">
                    <el-option value="" >
                      <el-tree :data="tree" show-checkbox default-expand-all node-key="id" ref="organ" :indent="8"
                               @check-change="organTreeChange" highlight-current :props="defaultPropss"
                               :expand-on-click-node="false" :render-content="renderContent">
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="身份证号" prop="paperNo">
                  <el-input v-model="form.paperNo" placeholder="请输入身份证号"
                            @blur="form.paperNo = form.paperNo.trim()"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                  <el-date-picker v-model="form.birthday" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="职位" prop="jobTitle">
                  <el-input v-model="form.jobTitle"
                            placeholder="请选择职位"
                            @focus="showPositionList = true"
                            >
                    <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear" @click="clearPosition"></i>
                  </el-input>
                  <transition name="el-zoom-in-top">
                    <div class="selectList legalPerList" v-if="showPositionList && positions && positions.length > 0">
                      <ul>
                        <li v-for="(item) in positions"
                            :key="item.id"
                            @click="selectPosition(item)"
                            :class="item.id === null ? 'create' : ''">
                          <span>{{ item.text }}</span>
                          <el-button type='text' v-if="item.id === null" @click="creatPosition">创建新职位</el-button>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </el-form-item>
                <el-form-item label="工牌号" prop="idCard">
                  <el-input v-model="form.idCard" placeholder="请输入20个以内的数字或字符"
                            @blur="form.idCard = form.idCard.trim()"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="button-box">
          <div class="btn-box clearfix">
            <el-button @click="cancel()">取消</el-button>
            <el-button @click="sendForm('form')" :disabled="isDisabled" :class="{'disabledBtn':isDisabled}">保存并继续</el-button>
            <el-button class="save saasbtn-primary saasbtn-primary:hover" type="primary"
                       @click="submitForm('form')" :disabled="isDisabled" :class="{'disabledBtn':isDisabled}"
            >保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'md5'
  export default {
    created () {
      const self = this
      this.$http.axios.all([this.getTree(), this.getEducation(), this.getRolesLevel(), this.getPosition()])
        .then(self.$http.axios.spread(function (tree, education, roletree, position) {
          if (tree.data.code === '0') {
            self.tree = tree.data.data
          } else if (tree.data.msg) {
            self.$message({type: 'error', message: tree.data.msg})
          }
          if (education.data.code === '0') {
            self.educations = education.data.data
          } else if (education.data.msg) {
            self.$message({
              message: education.data.msg,
              type: 'error'
            })
          }
          if (roletree.data.code === '0') {
            self.roleTree = JSON.parse(roletree.data.data)
          } else if (roletree.data.msg) {
            self.$message({
              message: roletree.data.msg,
              type: 'error'
            })
          }
          if (position.data.code === '0') {
            self.positions = self.allPositions = position.data.data
          } else if (position.data.msg) {
            self.$message({
              message: position.data.msg,
              type: 'error'
            })
          }
          if (self.$store.state.cacheData.empId !== 0) {
            self.queryEmployeeById()
          }
        })
        ).catch(function (err) {
          if (err) {
            self.$message({
              message: err.msg,
              type: 'error'
            })
          }
        })
    },
    data () {
      return {
        empId: this.$store.state.cacheData.empId,
        roleTree: [],
        tree: [],
        educations: [],
        positions: [],
        allPositions: [],
        showPositionList: false,
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        defaultPropss: {
          children: 'children',
          label: 'text'
        },
        form: {
          empAccount: '',
          rolesId: '',
          RoleAuthority: '',
          empName: '',
          sex: '',
          phone: '',
          education: '',
          password: '',
          storeId: '',
          organName: '',
          paperNo: '',
          birthday: '',
          jobTitle: '',
          jobCode: '',
          idCard: '',
          empId: '',
          userAuthorityId: '',
          defaultStoreId: ''
        },
        isShowSetDefault: false,
        showSetId: '',
        rules: {
          empAccount: [
            {required: true, message: '账号是必填项', trigger: 'blur'},
            {max: 20, message: '长度不得大于20个字符', trigger: 'change'}
          ],
          rolesId: [
            {required: true, message: '角色权限是必填项', trigger: 'blur'}
          ],
          empName: [
            {required: true, message: '姓名是必填项', trigger: 'blur'},
            {max: 20, message: '长度不得大于20个字符', trigger: 'change'}
          ],
          phone: [
            { message: '请输入正确的手机号', trigger: 'blur', pattern: /^[1][3,4,5,7,8][0-9]{9}$/ }
          ],
          password: [
            {required: true, message: '密码是必填项', trigger: 'blur'},
            {max: 40, message: '长度不得大于40个字符', trigger: 'change'}
          ],
          storeId: [
            {required: true, message: '适用机构是必填项', trigger: 'change'}
          ],
          paperNo: [
            { message: '请输入正确的身份证号', trigger: 'blur', pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ }
          ],
          idCard: [
            {max: 20, message: '长度不得大于20个字符', trigger: 'change'}
          ]
        },
        labelPosition: 'left',
        oldPwd: ''
      }
    },
    methods: {
      queryEmployeeById: function () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/queryEmployeeById', {
          empId: this.empId
        }).then(function (res) {
          if (res.data.code === '0') {
            if (self.empId !== 0) {
              for (var key in res.data.data.empInfo) {
                self.form[key] = res.data.data.empInfo[key]
              }
              self.oldPwd = self.form.password
              self.form.organName = ''
              self.form.RoleAuthority = ''
              self.$refs.organ.setCheckedKeys(res.data.data.empCheckedOrgIds)
              var organNameList = []
              var RoleAuthorityList = []
              res.data.data.empCheckedOrgIds.forEach(function (item) {
                self.listFind(self.tree, item, organNameList, 'text', self)
              })
              self.listFind(self.roleTree, self.form.rolesId, RoleAuthorityList, 'text', self)
              self.form.organName = organNameList.join(',')
              self.form.RoleAuthority = RoleAuthorityList[0]
            }
          } else if (res.data.msg) {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }).catch(function (err) {
          if (err) {
            self.$message({
              message: err.msg,
              type: 'error'
            })
          }
        })
      },
      submitForm: function (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (self.$store.state.cacheData.empId === 0) {
              self.form.password = md5(self.form.password)
            } else {
              if (self.form.password !== self.oldPwd) self.form.password = md5(self.form.password)
            }
            this.$http.post('/api/employee/employeeContraller/saveEmployee', {form: self.form})
              .then(function (res) {
                if (res.data.code === '0') {
                  self.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                  self.$router.push('/personManage')
                } else if (res.data.msg) {
                  self.$message({
                    message: res.data.msg,
                    type: 'error'
                  })
                }
              }).catch(function (err) {
                if (err) {
                  self.$message({
                    message: err.msg,
                    type: 'error'
                  })
                }
              })
          }
        })
      },
      sendForm: function (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (self.$store.state.cacheData.empId === 0) {
              self.form.password = md5(self.form.password)
            } else {
              if (self.form.password !== self.oldPwd) self.form.password = md5(self.form.password)
            }
            this.$http.post('/api/employee/employeeContraller/saveEmployee', {form: self.form})
              .then(function (res) {
                if (res.data.code === '0') {
                  self.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                  self.form.empAccount = ''
                  self.form.empName = ''
                  self.form.sex = ''
                  self.form.phone = ''
                  self.form.education = ''
                  self.form.password = ''
                  self.form.paperNo = ''
                  self.form.birthday = ''
                  self.form.jobTitle = ''
                  self.form.jobCode = ''
                  self.form.idCard = ''
                  self.form.empId = ''
                  self.oldPwd = ''
                  self.isShowSetDefault = false
                } else if (res.data.msg) {
                  self.$message({
                    message: res.data.msg,
                    type: 'error'
                  })
                }
              }).catch(function (err) {
                if (err) {
                  self.$message({
                    message: err.msg,
                    type: 'error'
                  })
                }
              })
          }
        })
      },
      cancel: function () {
        this.$router.push('/personManage')
      },
      getTree () {
        return this.$http.post('/api/organization/organ/getOrganTree')
      },
      TreeArrToStr (arr, type) {
        return arr.map(function (item) {
          return item[type]
        }).join(',')
      },
      listFind (tree, findId, resList, type, self) {
        tree.forEach(function (item) {
          if (item.id - 0 === findId - 0) {
            resList.push(item[type])
          } else {
            if (item.children) {
              self.listFind(item.children, findId, resList, type, self)
            }
          }
        })
      },
      organTreeChange () {
        this.form.organName = this.TreeArrToStr(this.$refs.organ.getCheckedNodes(), 'text')
        this.form.storeId = this.TreeArrToStr(this.$refs.organ.getCheckedNodes(), 'id')
      },
      roleAuthorityTreeChange (data, node, self) {
        this.form.RoleAuthority = data.text
        this.form.rolesId = data.id
      },
      renderContent (h, {node, data, store}) {
        if (node.checked) {
          if (data.id - 0 === this.form.defaultStoreId - 0) {
            return (
              <span
            style = 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;' >
              <span>{node.label}<span style ='font-size: 12px;color:blue;margin-left:8px' > 默认 </span></span>
            </span>)
          } else {
            if (this.isShowSetDefault && this.showSetId - 0 === data.id - 0) {
              return (
                <span
              style = 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'
              on-mouseleave = {() => this.ShowSetDefault(false)}>
            <span > {node.label}
            <span style = 'font-size: 12px;color:blue;margin-left:8px;cursor: pointer;'
              on-click = {() => this.setDefaultOrgan(data)}>设为默认 < /span>
              </span>
              </span>)
            } else {
              return (
                <span
              style = 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'
              on-mouseenter = {() => this.ShowSetDefault(true, data)}>
            <span>{node.label}</span>
              </span>)
            }
          }
        } else {
          return (
            <span
          style = 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;' >
            <span>{node.label}</span>
          </span>)
        }
      },
      setDefaultOrgan (data) {
        this.form.defaultStoreId = data.id
        this.isShowSetDefault = false
      },
      ShowSetDefault (flag, data) {
        this.isShowSetDefault = flag
        if (flag) {
          this.showSetId = data.id
        } else {
          this.showSetId = ''
        }
      },
      getEducation () {
        return this.$http.post('/api/employee/employeeContraller/getComboboxByClassIdentifierCode', {class_identifier_code: 'education'})
      },
      getRolesLevel () {
        return this.$http.post('/api/role/roles/getRolesLevelCombotree', {})
      },
      getPosition () {
        return this.$http.post('/api/employee/employeeContraller/getComboboxByClassIdentifierCode', {class_identifier_code: 'position'})
      },
      resetpwd () {
        this.form.password = '123456'
        this.$message({
          type: 'success',
          message: '密码已重置为123456'
        })
      },
      clearPosition () {
        this.showPositionList = false
        this.form.jobCode = null
        this.form.jobTitle = ''
      },
      selectPosition (Position) {
        this.showPositionList = false
        this.form.jobCode = Position.id
        this.form.jobTitle = Position.text
      },
      creatPosition () {
        this.$http.post('api//system/personnel/save', {form: {
          classItem: this.form.jobTitle
        }}).then(res => {
          if (res.data.code === '0') {
            this.allPositions.push({
              id: res.data.classItemCode,
              text: this.form.jobTitle
            })
            this.positions[this.positions.length - 1].id = res.data.data.classItemCode
            this.form.jobCode = res.data.data.classItemCode
          } else if (res.data.msg) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
          .catch(err => {
            if (err) {
              this.$message({
                type: 'error',
                message: err.msg
              })
            }
          })
      }
    },
    components: {},
    watch: {
      jobTitle (value) {
        if (value !== null) {
          value = value.trim()
          this.positions = this.allPositions.filter(item => {
            return item.text && item.text.indexOf(value) > -1
          })
          let index = this.allPositions.findIndex(item => {
            return item.text && item.text === value
          })
          if (index === -1 && value !== '') {
            this.positions.push({
              id: null,
              text: value
            })
          }
        } else {
          this.positions = this.allPositions
        }
      }
    },
    computed: {
      isDisabled () {
        return !(this.form.empAccount && this.form.rolesId && this.form.empName && this.form.password && this.form.storeId)
      },
      jobTitle () {
        return this.form.jobTitle
      }
    }
  }
</script>
<style lang="less" type="text/less">
  #editPersonManage {
    .add-main {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
      .form-container {
        .el-form.el-form--label-left {
          width: 100%;
          .el-row {
            width: 100%;
            min-width: 1200px;
            max-width: 1450px;
            margin: 0 0 0 -6px !important;
            padding: 0 !important;
            .el-col.el-col-12 {
              width: 550px;
              margin: 0 !important;
              padding: 0 0 0 30px !important;
              .el-form-item {
                width: 100%;
                margin: 0;
                .el-form-item__label {
                  position: relative;
                  font-family: PingFangSC-Regular, "Microsoft YaHei";
                  font-size: 14px;
                  color: #576D7A;
                  line-height: 20px;
                  padding: 14px 0;
                }
                .el-form-item__content {
                  line-height: normal;
                  padding: 8px 0;
                  height: 48px;
                  width: 230px;
                  .el-input {
                    .el-input__inner {
                      height: 32px;
                      width: 230px;
                      font-size: 14px;
                      color: #9AABB8;
                      line-height: 14px;
                      padding: 0 30px 0 8px;
                      border-radius: 3px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                  .reset {
                    position: absolute;
                    left: 230px;
                    top: 8px;
                    height: 32px;
                    margin-left: 8px;
                    border-radius: 3px;
                    font-size: 14px;
                    padding: 0 20px;
                    cursor: pointer;
                  }
                  .el-radio-group {
                    .el-radio {
                      height: 32px;
                      line-height: 32px;
                      margin: 0 30px 0 0;
                      .el-radio__label {
                        padding-left: 6px;
                      }
                    }
                  }
                  .el-select {
                    .el-input.el-input--suffix {
                      width: 100%;
                    }
                  }
                  .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
                    .el-input__prefix {
                      .el-input__icon.el-icon-date {
                        &:before {
                          position: absolute;
                          right: -190px;
                          top: -3px;
                        }
                      }
                    }
                    .el-input__suffix {
                      .el-input__suffix-inner {
                        .el-input__icon.el-icon-circle-close:before {
                          position: absolute;
                          right: 15px;
                          top: -3px;
                        }
                      }
                    }
                  }
                }
              }
              .el-form-item.is-required {
                .el-form-item__label:before {
                  position: absolute;
                  top: 17px;
                  left: -9px;
                }
              }
              .el-form-item.is-error {
                .el-form-item__content {
                  .el-form-item__error {
                    padding: 0;
                    top: auto;
                    bottom: -5px;
                  }
                }
              }
            }
            .el-col.el-col-24 {
              width: 936px;
              margin: 8px 0 !important;
              padding: 0 0 0 30px !important;
              .el-form-item {
                margin: 0;
                .el-form-item__label {
                  height: 70px;
                  line-height: 70px;
                }
                .el-form-item__content {
                  .el-textarea {
                    .el-textarea__inner {
                      resize: none;
                      height: 70px;
                      width: 100%;
                      padding: 8px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

