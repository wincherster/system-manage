<template>
  <div class="transfer" id="app">
    <div class="content">
      <div class="banner">
        <div class="top">
          <div class="title"> 天子星云餐饮平台</div>
          <a class="user-tool">
            <div class="admin" @mouseenter="showadmintool=true" @mouseleave="showadmintool=false">
              <ul v-if="showadmintool">
                <div class="space"></div>
                <li @click='showEditPwd = true'><i class="saas saas-header-changepassword"></i>修改密码</li>
                <li @click="logout"><i class="saas saas-header-logout"></i>退出</li>
              </ul>
            </div>
          </a>
          <div class="hello">
            <p>您好，<span v-text="userInfo.empAccount"></span>！</p>
          </div>
        </div>
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
        <div class="middle">
          <p class="one">开启智慧餐饮新纪元</p>
          <p class="two">天子星您身边的连锁餐饮信息化专家</p>
        </div>
      </div>
      <div class="items">
        <ul>
          <li :class="{ hide: !userHasModule.module101 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module101">
              <span class="one"></span>
              <p class="system">系统管理</p>
              <p class="info">机构·人员·设置·公告</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module102 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module102">
              <span class="two"></span>
              <p class="system">运营管理</p>
              <p class="info">开店·菜谱·优惠·设备</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module103 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module103">
              <span class="three"></span>
              <p class="system">会员管理</p>
              <p class="info">开店·菜谱·优惠·设置</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module104 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module104">
              <span class="four"></span>
              <p class="system">门店后台</p>
              <p class="info">资金·人事·库存</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module105 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module105">
              <span class="five"></span>
              <p class="system">统采直配</p>
              <p class="info">配送·报表</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module106 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module106">
              <span class="six"></span>
              <p class="system">供应链</p>
              <p class="info">采购·仓储·配送</p>
            </a>
          </li>
          <li :class="{ hide: !userHasModule.module107 }">
            <div class="Mask"></div>
            <a :href="userHasModule.module107">
              <span class="seven"></span>
              <p class="system">报表管理</p>
              <p class="info">运营·crm·库存报表</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="download">
      <div class="content">
        <div class="center">
          <p>下载中心</p>
        </div>
        <div class="btns">
          <ul>
            <li>
              <a>
                <span class="pic1"></span>
                <p class="miaoshu">e收银</p>
                <div class="popup">
                  <p >敬请期待</p>
                  <div class="bottom">
                    <div class="xsj"></div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a>
                <span class="pic2"></span>
                <p class="miaoshu">e指馋</p>
                <div class="popup">
                  <p >敬请期待</p>
                  <div class="bottom">
                    <div class="xsj"></div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a>
                <span class="pic3"></span>
                <p class="miaoshu">e自助</p>
                <div class="popup">
                  <p >敬请期待</p>
                  <div class="bottom">
                    <div class="xsj"></div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a>
                <span class="pic4"></span>
                <p class="miaoshu">e待客</p>
                <div class="popup">
                  <p >敬请期待</p>
                  <div class="bottom">
                    <div class="xsj"></div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a>
                <span class="pic5"></span>
                <p class="miaoshu">操作手册</p>
                <div class="popup">
                  <p >敬请期待</p>
                  <div class="bottom">
                    <div class="xsj"></div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bot">
      <div class="content">
        <p>版权所有 © 北京普照天星科技有限公司</p>
        <p>京ICP备05009634号</p>
        <p>|</p>
        <p>京公安备案号11010802020547</p>
      </div>
    </div>
  </div>
</template>
<script>
  import md5 from 'md5'
  export default {
    created () {
      this.getUserLogin()
      this.getUserInfo()
    },
    data () {
      var oldPasswordRule = (rule, value, callback) => {
        if (md5(value) !== this.userInfo.password) {
          callback(new Error('密码不正确'))
        } else {
          callback()
        }
      }
      var newPasswordRule = (rule, value, callback) => {
        if (md5(value) === this.userInfo.password) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      }
      return {
        formLabelWidth: '55px',
        items: [],
        visible: false,
        dialogVisible: false,
        showEditPwd: false,
        activeName: '',
        showadmintool: false,
        tags: [],
        orgTree: [],
        tabTitle: [],
        ids: [],
        userHasModule: {
          module101: '',
          module102: '',
          module103: '',
          module104: '',
          module105: '',
          module106: '',
          module107: ''
        },
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
    methods: {
      getUserInfo: function () {
        let self = this
        this.$http.post('/api/employee/employeeContraller/getCurrentLoginEmpInfo', {})
          .then(function (res) {
            if (res.data.code === '0') {
              self.userInfo = res.data.data
              self.form.empAccount = res.data.data.empAccount
              self.form.empId = res.data.data.empId
            } else {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      logout () {
        this.$http.post('/api/employee/employeeContraller/logout', {})
          .then(res => {
            if (res.data.code === '0') {
              this.$message({
                message: '退出成功！',
                type: 'success'
              })
              location.href = res.data.data.url
            }
          })
          .catch(function (err) {
            console.log(err)
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
            this.getUserInfo()
            this.$refs[formName].resetFields()
            this.showEditPwd = false
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          if (err) {
            console.log(err)
          }
        })
      },
      closeEditPwd (formName) {
        this.$refs[formName].resetFields()
        this.showEditPwd = false
      },
      getUserLogin () {
        const self = this
        this.$http.post('/api/homepage/hp/findUserAuthModul').then(function (res) {
          if (res.data.code === '0') {
            if (res.data.data.smInfo.sysModule.length === 1) {
              self.userHasModule['module' + res.data.data.smInfo.sysModule[0].id] = res.data.data.smInfo.sysModule[0].moduleLinkUrl
              window.location.href = res.data.data.smInfo.sysModule[0].moduleLinkUrl
            }
            res.data.data.smInfo.sysModule.forEach(function (item) {
              self.userHasModule['module' + item.id] = item.moduleLinkUrl
            })
          } else {
            self.$message({type: 'error', message: res.data.msg})
          }
        }).catch(function (err) {
          console.log(err)
          self.$message({type: 'error', message: '网络异常,请刷新重试'})
        })
      }
    }
  }
</script>
<style type="text/less" lang="less">
  @import "./home.less";
  @import "./popup.less";
</style>
