<style lang="less" scoped>
  @import "./editSystemNotice.less";
</style>
<template>
  <div class="editSystemNotice add-box">
    <div class="add-header">
      <h3>{{this.$store.state.cacheData.noticeTitle ? '编辑' : '新增'}}系统公告</h3>
    </div>
    <div class="line"></div>
    <div class="add-body">
      <div class="add-main">
        <div class="form-container">
          <el-form :label-position="labelPosition" ref="form" :model="form" :rules="rules" label-width="126px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="公告标题" prop="noticeTitle">
                  <el-input v-model="form.noticeTitle" placeholder="请输入50个以内的汉字或字符"
                            @blur="form.noticeTitle = form.noticeTitle.trim()"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="发送渠道" prop="sendChannels">
                  <el-select v-model="form.sendChannels" placeholder="请选择发布渠道" popper-class="tree-select">
                    <el-option label="" value="">
                      <el-tree
                        :data="channelList"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="channelTree"
                        @check-change="channelTreeChange"
                        highlight-current
                        :props="channel">
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发送机构" prop="sendOrgan" v-if="showorganizationList">
                  <el-select v-model="form.sendOrgan" placeholder="请选择发送机构" readonly popper-class="tree-select">
                    <el-option label="" value="">
                      <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                      </el-input>
                      <el-tree
                        class="filter-tree"
                        :data="organizationList"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="organizationTree"
                        @check-change="organizationTreeChange"
                        :filter-node-method="filterNode"
                        highlight-current
                        :props="organization">
                      </el-tree>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="发送方式：" prop="sendMode">
                  <el-radio-group v-model="form.sendMode">
                    <el-radio :label="'1'">即时发送</el-radio>
                    <el-radio :label="'2'">定时发送</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发送时间：" prop="Time" v-if="form.sendMode==2">
                  <el-date-picker
                    v-model="form.Time"
                    type="datetime"
                    :picker-options="pickeroptions"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="署名" prop="noticeSignature">
                  <el-input v-model="form.noticeSignature"
                            placeholder="请选择署名"
                            @focus="showSignList = true"
                            @blur="form.noticeSignature = form.noticeSignature.trim();showSignList = false">
                    <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear"
                       @click="clearnoticeSignature"></i>
                  </el-input>
                  <transition name="el-zoom-in-top">
                    <div class="selectList legalPerList" v-if="showSignList && sign ">
                      <ul>
                        <li v-for="(item,index) in sign"
                            :key="index"
                            @click="selectnoticeSignature(item)"
                            :class=" no(item) ? 'create' : ''">
                          <span>{{ item }}</span>
                          <el-button type='text' v-if="no(item)">创建新署名</el-button>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="公告信息" prop="noticeInfo">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输10000个以内汉字或字符支持空格、回车"
                    @blur="form.noticeInfo = form.noticeInfo.trim()"
                    v-model="form.noticeInfo">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="button-box">
          <div class="btn-box clearfix">
            <el-button @click="cancel()">取消</el-button>
            <el-button @click="sendToDrafts('form')" :disabled="isDisabled" :class="{'disabledBtn':isDisabled}">存草稿箱
            </el-button>
            <el-button @click="preview('form')" :disabled="isDisabled" :class="{'disabledBtn':isDisabled}">预览
            </el-button>
            <el-button class="save saasbtn-primary saasbtn-primary:hover" type="primary"
                       :disabled="isDisabled" :class="{'disabledBtn':isDisabled}"
                       @click="submitForm('form')">发送
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      if (this.$store.state.cacheData.noticeTitle) {
        this.cacheData = this.$store.state.cacheData
        this.$store.state.cacheData = {}
        this.form.Time = new Date(this.cacheData.timingTime)
        this.channelSelectId = this.cacheData.sendChannels
        this.form.sendChannels = this.cacheData.sendChannels
        this.form.sendOrgan = this.cacheData.sendOrgan
        this.organizationSelectId = this.cacheData.sendOrgan
        this.form.noticeTitle = this.cacheData.noticeTitle
        this.form.noticeInfo = this.cacheData.noticeInfo
        this.form.noticeSignature = this.cacheData.noticeSignature
        this.form.sendMode = this.cacheData.sendMode
      }
      this.getTreeData()
    },
    data () {
      return {
        cacheData: {},
        labelPosition: 'left',
        form: {
          noticeTitle: '',
          sendChannels: '',
          sendOrgan: '',
          sendMode: '1',
          Time: '',
          noticeSignature: '',
          noticeInfo: ''
        },
        rules: {
          noticeTitle: [
            {required: true, message: '公告标题是必填项', trigger: 'blur'},
            {min: 1, max: 50, message: '长度不得大于50个汉字或字符', trigger: 'change'}
          ],
          sendMode: [
            {required: true, message: '发送方式是必填项', trigger: 'blur'}
          ],
          noticeSignature: [
            {required: true, message: '署名是必填项', trigger: 'blur'},
            {max: 40, message: '长度不得大于40个字符', trigger: 'change'}
          ],
          sendChannels: [
            {required: true, message: '发送渠道是必填项', trigger: 'change'}
          ],
          Time: [
            {required: true, message: '发送时间是必填项', trigger: 'blur'}
          ],
          noticeInfo: [
            {required: true, message: '公告信息是必填项', trigger: 'blur'},
            {max: 10000, message: '信息长度不得大于10000个字符', trigger: 'change'}
          ],
          sendOrgan: [
            {required: true, message: '发送机构是必填项', trigger: 'change'}
          ]
        },
        channel: {
          children: 'children',
          label: 'channel'
        },
        organization: {
          children: 'children',
          label: 'orgFullName'
        },
        channelList: [],
        channelSelectId: '',
        channelSelect: [],
        organizationList: [],
        organizationSelectId: '',
        organizationSelect: [],
        sign: [],
        allSign: [],
        showSignList: false,
        showorganizationList: false,
        pickeroptions: {
          disabledDate (time) {
            return (Date.parse(new Date(time)) < Date.parse(new Date(new Date().toLocaleDateString())))
          }
        },
        filterText: '',
        organizationListFindList: []
      }
    },
    methods: {
      submitForm: function (formName) {
        const self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              form: {
                type: 1,
                noticeTitle: this.form.noticeTitle,
                sendChannels: this.channelSelectId,
                sendOrgan: this.organizationSelectId,
                sendMode: this.form.sendMode,
                noticeSignature: this.form.noticeSignature,
                noticeInfo: this.form.noticeInfo,
                timingTime: this.form.Time
              }
            }
            if (this.cacheData.id) {
              data.form.id = this.cacheData.id
              data.form.isRecall = 0
            }
            this.$http.post('/api/system/messager/save', data)
              .then(function (res) {
                if (res.data.code === '0') {
                  self.$message({
                    message: '发送成功',
                    type: 'success'
                  })
                  self.$store.state.activeTabName = 'send'
                  self.$router.push('/SystemNotice')
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
          }
        })
      },
      sendToDrafts:
        function (formName) {
          const self = this
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data = {
                form: {
                  type: 3,
                  drafts: '1',
                  noticeTitle: this.form.noticeTitle,
                  sendChannels: this.channelSelectId,
                  sendOrgan: this.organizationSelectId,
                  sendMode: this.form.sendMode,
                  noticeSignature: this.form.noticeSignature,
                  noticeInfo: this.form.noticeInfo,
                  timingTime: this.form.Time
                }
              }
              if (this.cacheData.id) {
                data.form.id = this.cacheData.id
                data.form.isRecall = 0
              }
              this.$http.post('/api/system/messager/save', data)
                .then(function (res) {
                  if (res.data.code === '0') {
                    self.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                    self.$store.state.activeTabName = 'draft'
                    self.$router.push('/SystemNotice')
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
            }
          })
        },
      preview () {
        this.$store.state.cacheData = {
          noticeTitle: this.form.noticeTitle,
          sendChannels: this.channelSelectId,
          sendOrgan: this.organizationSelectId,
          sendMode: this.form.sendMode,
          noticeSignature: this.form.noticeSignature,
          noticeInfo: this.form.noticeInfo,
          timingTime: this.form.Time
        }
        this.$router.push('/systemNoticeDetail')
      },
      cancel () {
        this.$router.push('/SystemNotice')
      },
      getTreeData () {
        const self = this
        this.$http.post('/api/system/messager/getChannel')
          .then(function (res) {
            if (res.data.code === '0') {
              self.channelList = res.data.data[0].channel
              self.organizationList = res.data.data[0].organization
              self.allSign = self.sign = res.data.data[0].sign
              if (self.form.noticeTitle) {
                self.$refs.channelTree.setCheckedKeys(self.form.sendChannels.split(','))
                self.form.sendChannels = self.yongwanjiukai(self.form.sendChannels, self.channelList, 'channel').join(',')
                if (self.form.sendOrgan) {
                  self.$refs.organizationTree.setCheckedKeys(self.form.sendOrgan.split(','))
                  self.form.sendOrgan.split(',').forEach(function (item) {
                    self.organizationListFind(self.organizationList, parseInt(item), self)
                  })
                  self.form.sendOrgan = self.organizationListFindList.join(',')
                }
              }
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
      lajigongsi (arr, type) {
        return arr.map(function (item) {
          return item[type]
        }).join(',')
      },
      yongwanjiukai (str, list, type) {
        let arr = []
        const strArr = str.split(',')
        list.forEach(function (item) {
          item.children.forEach(function (child) {
            strArr.forEach(function (strId) {
              if (child.id === strId) {
                arr.push(child[type])
              }
            })
          })
        })
        return arr
      },
      organizationListFind (list, find, self) {
        list.forEach(function (item) {
          if (item.id === find) {
            self.organizationListFindList.push(item.orgFullName)
          } else {
            if (item.children) {
              self.organizationListFind(item.children, find, self)
            }
          }
        })
      },
      channelTreeChange () {
        this.form.sendChannels = this.lajigongsi(this.$refs.channelTree.getCheckedNodes(true), 'channel')
        this.channelSelectId = this.lajigongsi(this.$refs.channelTree.getCheckedNodes(true), 'id')
      },
      organizationTreeChange () {
        this.form.sendOrgan = this.lajigongsi(this.$refs.organizationTree.getCheckedNodes(true), 'orgFullName')
        this.organizationSelectId = this.lajigongsi(this.$refs.organizationTree.getCheckedNodes(true), 'id')
      },
      filterNode (value, data) {
        if (!value) return true
        return data.orgFullName.indexOf(value) !== -1
      },
      clearnoticeSignature () {
        this.showSignList = false
        this.form.noticeSignature = ''
      },
      selectnoticeSignature (sign) {
        this.showSignList = false
        this.form.noticeSignature = sign
      },
      no (item) {
        let index = -1
        index = this.allSign.findIndex(sign => {
          return item === sign
        })
        return (index === -1)
      }
    },
    computed: {
      isDisabled () {
        if (!this.showorganizationList) {
          if (this.form.sendMode === '1') {
            return !(this.form.noticeTitle && this.form.noticeSignature && this.form.sendChannels && this.form.noticeInfo)
          } else {
            return !(this.form.noticeTitle && this.form.noticeSignature && this.form.sendChannels && this.form.noticeInfo && this.form.Time)
          }
        } else {
          if (this.form.sendMode === '1') {
            return !(this.form.noticeTitle && this.form.noticeSignature && this.form.sendChannels && this.form.noticeInfo && this.form.sendOrgan)
          } else {
            return !(this.form.noticeTitle && this.form.noticeSignature && this.form.sendChannels && this.form.noticeInfo && this.form.Time && this.form.sendOrgan)
          }
        }
      },
      noticeSignature () {
        return this.form.noticeSignature
      }
    },
    watch: {
      filterText (val) {
        this.$refs.organizationTree.filter(val)
      },
      channelSelectId (val) {
        this.showorganizationList = !(val.split(',').every(function (item) {
          return item !== 'ph' && item !== 'dc' && item !== 'wm'
        }))
      },
      noticeSignature (value) {
        if (value !== '') {
          value = value.trim()
          this.sign = this.allSign.filter(item => {
            return item.indexOf(value) > -1
          })
          let index = this.allSign.findIndex(item => {
            return item === value
          })
          if (index === -1 && value !== '') {
            this.sign.push(value)
          }
        } else {
          this.sign = this.allSign
        }
      }
    }
  }
</script>
<style lang="less">
  .editSystemNotice {
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
                  .el-input {
                    width: 230px;
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
                  .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--datetime {
                    .el-input__prefix {
                      right: -5px;
                      left: auto;
                      width: 25px;
                      i.el-input__icon.el-icon-time {
                        line-height: 1;
                      }
                    }
                    .el-input__suffix {
                      right: 10px;
                      .el-input__suffix-inner {
                        .el-input__icon.el-icon-circle-close {
                          line-height: 1;
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
                  position: relative;
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
              .el-form-item.is-required {
                .el-form-item__label:before {
                  position: absolute;
                  top: 3px;
                  left: -9px;
                }
              }
              .el-form-item.is-error {
                .el-form-item__content {
                  .el-form-item__error {
                    padding: 0;
                    top: auto;
                    bottom: -15px;
                  }
                }
              }
            }
          }
        }
      }
      .button-box {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        min-width: 1100px;
        max-width: 1600px;
        width: 100%;
        .btn-box {
          margin: 0 auto;
          .el-button {
            float: left;
            margin: 0 5px;
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            font-size: 14px;
            color: #34495E;
          }
          .save {
            color: #fff;
          }
        }
      }
    }
  }

  .el-form .el-form-item .selectList {
    background-color: #fff;
    position: absolute;
    left: 0;
    z-index: 1;
    width: 230px;
    max-height: 280px;
    border: 1px solid #BDCCD7;
    box-shadow: 0 3px 8px 0 #E8F1F7;
    border-radius: 0 0 3px 3px;
    padding: 8px 0;
    overflow-y: auto;
  }

  .el-form .el-form-item .selectList li {
    height: 32px;
    line-height: 32px;
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 14px;
    color: #34495E;
    letter-spacing: 0;
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-form .el-form-item .selectList li:hover {
    background-color: #F2F6FB;
  }

  .el-form .el-form-item .selectList li span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-form .el-form-item .selectList li span,
  .el-form .el-form-item .selectList li .el-button {
    font-family: "PingFangSC-Regular", "微软雅黑";
    font-size: 14px;
  }

  .el-form .el-form-item .selectList li.create {
    border-top: 1px solid #BDCCD7;
  }
</style>
