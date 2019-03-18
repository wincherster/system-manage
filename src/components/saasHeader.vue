<template>
  <div class="body-header">
    <div class="fl-right">
      <div class="Header-not">
        <a href="javascipt:void(0)" @click="returnHome('0')">
          <i class="saas saas-header-home"></i>
        </a>
      </div>
      <div class="Header-not" @click="goSystemNews">
        <i class="saas saas-header-inform">
          <span class="msgCount" v-if="getNewsCount > 0">{{getNewsCount}}</span>
        </i>
      </div>
      <div class="Header-user">
        <el-dropdown>
                <span class="el-dropdown-link">
                    <i class="saas saas-header-admin fl-left"></i>
                    <span class="header-admin fl-left" v-text="userInfo.empAccount"></span>
                    <i class="el-icon-caret-bottom el-icon--right fl-left"></i>
                </span>
          <el-dropdown-menu slot="dropdown">
            <div>
              <div class="Header-portrait">
                <img class="Header-img" src='./../assets/images/tx.png'>
              </div>
              <div class="Header-usernm">
                <p class="Header-nm" v-text="userInfo.empAccount"></p>
                <div class="Header-include">
                  <span class="Header-dm">部门：</span>
                  <span class="Header-sf" v-text="userInfo.rolesName"></span>
                </div>
                <div class="Header-includeone">
                  <span class="Header-dm">职位：</span>
                  <span class="Header-sf" v-text="userInfo.jobTitle"></span>
                </div>
              </div>
              <div class="Header-btn fl-left">
                <button type="button" class="saasbtn saasbtn-system btn-margin" @click="toHomeIndex">
                  <i class="saas saas-header-returnguide saasbtn-icon-system"></i>
                  <span>返回引导页</span>
                </button>
                <button type="button" class="saasbtn saasbtn-system btn-margin" @click='showEditPwd = true'>
                  <i class="saas saas-header-changepassword saasbtn-icon-system"></i>
                  <span>修改密码</span>
                </button>
                <button type="button" class="saasbtn saasbtn-system btn-margin" @click="logout">
                  <i class="saas saas-header-logout saasbtn-icon-system"></i>
                  <span>退出系统</span>
                </button>
              </div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="editPwd">
          <el-dialog title="修改密码" :visible.sync="showEditPwd" :close-on-click-modal="false"
                     :close-on-press-escape="false" :show-close="false">
            <el-form :model="form" :rules="rules" ref="form">
              <el-form-item label="用户名:" :label-width="formLabelWidth" prop="empAccount">
                <el-input v-model="form.empAccount" disabled></el-input>
              </el-form-item>
              <el-form-item label="旧密码:" :label-width="formLabelWidth" prop="oldPwd">
                <el-input v-model="form.oldPwd" placeholder="请输入旧密码" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码:" :label-width="formLabelWidth" prop="newPwd">
                <el-input v-model="form.newPwd" placeholder="请输入新密码" type="password"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeEditPwd('form')">取 消</el-button>
              <el-button type="primary" @click="editPwd('form')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import md5 from 'md5'
  export default {
    name: 'ecsc-header',
    data () {
      let oldPasswordRule = (rule, value, callback) => {
        if (md5(value) !== this.userInfo.password) {
          callback(new Error('密码不正确'))
        } else {
          callback()
        }
      }
      let newPasswordRule = (rule, value, callback) => {
        if (md5(value) === this.userInfo.password) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      }
      return {
        msgCount: 0,
        formLabelWidth: '55px',
        showEditPwd: false,
        userInfo: {
          empId: '',
          empName: '',
          password: '',
          jobTitle: '',
          rolesName: '',
          empAccount: ''
        },
        form: {
          empAccount: '',
          oldPwd: '',
          newPwd: '',
          empId: ''
        },
        rules: {
          oldPwd: [
            {required: true, message: '旧密码是必填项', trigger: 'blur'},
            {max: 40, message: '长度不得大于40个字符', trigger: 'change'},
            {validator: oldPasswordRule, trigger: 'blur'}
          ],
          newPwd: [
            {required: true, message: '新密码是必填项', trigger: 'blur'},
            {max: 40, message: '长度不得大于40个字符', trigger: 'change'},
            {validator: newPasswordRule, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['isCollapse', 'getNewsCount'])
    },
    methods: {
      ...mapMutations(['toggleBtn', 'setNewsCount']),
      returnHome (name) {
        this.$store.dispatch('changeActiveTab', name)
      },
      goSystemNews: function () {
        let sysNews = {
          title: '系统消息',
          router: '/systemNews',
          active: false,
          level: 2,
          code: 'systemNews'
        }
        this.$store.dispatch('addNavTab', sysNews)
        this.$router.push({path: sysNews.router})
      },
      logout () {
        this.$http.post('/api/employee/employeeContraller/logout')
          .then(res => {
            if (res.data.code === '0') {
              this.$message({
                message: '退出成功！',
                type: 'success'
              })
              location.href = res.data.data.url
            } else if (res.data.msg) {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: err.msg,
                type: 'error'
              })
            }
          })
      },
      toHomeIndex () {
        window.location.href = '/page/home/index.html'
      },
      getUserInfo: function () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/getCurrentLoginEmpInfo', {})
          .then(function (res) {
            if (res.data.code === '0') {
              self.userInfo = res.data.data
              self.form.empAccount = res.data.data.empAccount
              self.form.empId = res.data.data.empId
            } else if (res.data.msg) {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              self.$message({
                message: err.msg,
                type: 'error'
              })
            }
          })
      },
      editPwd (formName) {
        this.$http.post('/api/employee/employeeContraller/updatePass', {
          empAccount: this.form.empAccount,
          oldPwd: this.userInfo.password,
          newPwd: md5(this.form.newPwd),
          empId: this.form.empId
        }).then(res => {
          if (res.data.code === '0') {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.showEditPwd = false
            this.getUserInfo()
          } else if (res.data.msg) {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          if (err) {
            this.$message({
              message: err.msg,
              type: 'error'
            })
          }
        })
      },
      closeEditPwd (formName) {
        this.$refs[formName].resetFields()
        this.showEditPwd = false
      },
      getNews () {
        this.$http.post('/api/system/messager/channelLoad', {
          logogramName: 'sys',
          pagination: {
            page: 1,
            pageSize: 9
          }
        }).then(res => {
          if (res.data.code === '0') {
            this.setNewsCount(res.data.data.noticeNum)
          } else if (res.data.msg) {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(err => {
          if (err) { this.$message({type: 'error', message: err.msg}) }
        })
      }
    },
    created: function () {
      this.getUserInfo()
      this.getNews()
    }
  }
</script>
<style lang="less" scoped>
  .body-header {
    height: 47px;
    width: 100%;
    background-color: #fff;
    box-shadow: 14px 0 rgba(33, 41, 50, 0.05);
    border-bottom: 1px solid #edf0f4;
  }
  .Header-not {
    float: left;
    width: 20px;
    height: 20px;
    margin-left: 20px;
    margin-top: 13px;
    i.saas {
      position: relative;
      span.msgCount {
        position: absolute;
        right: -10px;
        top: -10px;
        min-width: 18px;
        height: 18px;
        font-size: 12px;
        background: red;
        color: #fff;
        border-radius: 9px;
        line-height: 16px;
        text-align: center;
        border: 1px solid #fff;
      }
    }
  }
  .Header-user {
    float: left;
    margin-left: 20px;
    margin-top: 13px;
    margin-right: 20px;
  }
  .header-admin {
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 6px;
    font-size: 14px;
  }
  .el-icon--right {
    color: #939CA2;
    line-height: 20px;
    transition: 0.3s;
  }
  .saas-header-home,
  .saas-header-inform,
  .saas-header-admin {
    font-size: 16px;
    line-height: 16px;
    color: #939CA2;
  }
  .saas-header-home:hover,
  .saas-header-inform:hover,
  .Header-user:hover,
  .Header-user:hover .saas-header-admin,
  .Header-user:hover .header-admin {
    color: #0c9aff;
    cursor: pointer;
  }
  .Header-user:hover .el-icon--right {
    transform: rotateZ(180deg);
  }
  .el-dropdown-menu {
    width: 318px;
    height: 155px;
    padding: 0;
    background: #FFFFFF;
    border: 1px solid #E8EFF4;
    box-shadow: 0 0 8px 0 rgba(37, 57, 80, 0.06);
    border-radius: 6px;
  }
  .Header-portrait {
    float: left;
    width: 60px;
    height: 60px;
    margin-top: 30px;
    margin-bottom: 21px;
    margin-left: 30px;
    margin-right: 20px;
  }
  .Header-img {
    display: block;
    width: 60px;
    height: 60px;
  }
  .Header-usernm {
    float: left;
    width: 188px;
  }
  .Header-nm {
    font-size: 14px;
    line-height: 14px;
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 9px;
  }
  .Header-dm, .Header-sf {
    font-size: 12px;
    line-height: 22px;
    color: #758896;
  }
  .Header-sf {
    color: #34495e;
  }
  .Header-btn {
    float: left;
  }
  .btn-margin {
    float: left;
    margin-left: 8px;
  }
  .btn-margin:first-child {
    margin-left: 16px;
  }
</style>
<style lang="less">
  .body-header {
    .fl-right {
      .Header-user {
        .editPwd {
          .el-dialog__wrapper {
            .el-dialog {
              border-radius: 4px;
              width: 40%;
              .el-dialog__header {
                padding: 14px 30px 14px;
                height: 46px;
                border-bottom: 1px solid #EAF1F6;
                .el-dialog__title {
                  font-size: 16px;
                  color: #3A4159;
                  letter-spacing: 0;
                  font-family: PingFangSC-Regular;
                  line-height: 19px;
                  vertical-align: top;
                }
              }
              .el-dialog__body {
                padding: 20px 30px 0px;
                .el-form {
                  .el-form-item {
                    margin-bottom: 18px;
                    .el-form-item__label {
                      text-align: left;
                      position: relative;
                      padding: 0;
                      line-height: 32px;
                      font-family: PingFangSC-Regular;
                      font-size: 14px;
                      color: #576D7A;
                      &:before {
                        position: absolute;
                        left: -12px;
                        top: 2px;
                        margin: 0;
                      }
                    }
                    .el-form-item__content {
                      line-height: 32px;
                      .el-input {
                        .el-input__inner {
                          height: 32px;
                          font-size: 14px;
                          color: #3A4C5F;
                          line-height: 14px;
                        }
                      }
                    }
                  }
                }
              }
              .el-dialog__footer {
                padding: 0;
                height: 56px;
                line-height: 56px;
                text-align: center;
                background: #F4F9FC;
                .dialog-footer {
                  .el-button {
                    padding: 8px 20px;
                    margin: 0 5px;
                    > span {
                      font-size: 12px;
                      color: #34495E;
                      line-height: 12px;
                      font-weight: normal;
                    }
                    &.el-button--primary {
                      > span {
                        color: #FFFFFF;
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
  }

</style>
