<style lang="less" scoped>
  @import "./editLegalManage.less";
</style>
<template>
  <div class="add-box" id="editLegalManage">
    <div class="add-header">
      <h3 v-if="id>0">编辑法人类型</h3>
      <h3 v-else>新增法人类型</h3>
    </div>
    <div class="line"></div>
    <div class="add-body">
      <div class="add-main">
        <div class="form-container">
          <el-form :label-position="labelPosition" :model="form" :rules="rules" ref="form" label-width="150px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="法人名称：" prop="legalPerName">
                  <el-input v-model="form.legalPerName" placeholder="文字长度不得大于20个字符"></el-input>
                </el-form-item>
                <el-form-item label="是否开电子发票：">
                  <el-radio-group v-model="form.isBilling">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="纳税人识别号证书：" v-if="isShow">
                  <el-upload v-model="form.certificateUrl"
                             class="upload-demo"
                             ref="upload"
                             action="https://jsonplaceholder.typicode.com/posts/"
                             :on-preview="handlePreview"
                             :on-remove="handleRemove"
                             :file-list="fileList"
                             :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="微信开票第三方id：" prop="wechatPartyId" v-if="isShow">
                  <el-input v-model="form.wechatPartyId" placeholder="文字长度不得大于20个字符"></el-input>
                </el-form-item>
                <el-form-item label="发票明细：" prop="invoiceName">
                  <el-select v-model="form.invoiceName" placeholder="请选择发票明细" popper-class="input-select">
                    <el-option label="餐饮" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="税率：" prop="taxRate" v-if="form.isBilling">
                  <el-input v-model.number="form.taxRate" placeholder="请输入0-11之间数字,保留两位小数"></el-input>
                </el-form-item>
                <el-form-item label="销售纳税人识别号：" prop="cnpj" v-if="form.isBilling">
                  <el-input v-model="form.cnpj" placeholder="文字长度不得大于20个字符"></el-input>
                </el-form-item>
                <el-form-item label="销售方电话：" prop="sellerNumber" v-if="form.isBilling">
                  <el-input v-model.number="form.sellerNumber"></el-input>
                </el-form-item>
                <el-form-item label="销售方地址：" prop="sellerAddress" v-if="form.isBilling">
                  <el-input v-model="form.sellerAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="two">
                <el-form-item label="法人代码：" prop="legalPerCode">
                  <el-input v-model="form.legalPerCode" placeholder="文字长度不得大于20个字符"></el-input>
                </el-form-item>
                <el-form-item label="电子发票对接商：" v-if="form.isBilling">
                  <el-radio-group v-model="form.dockingMerchants" @change="radiosChange">
                    <el-radio :label="1">用友</el-radio>
                    <el-radio :label="2">百旺电子发票</el-radio>
                    <el-radio :label="3">瑞宏</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="证书密码：" prop="certificatePwd" v-if="isShow">
                  <el-input v-model="form.certificatePwd"></el-input>
                </el-form-item>
                <el-form-item label="微信开票密钥：" prop="wechatInvoiceKey" v-if="isShow">
                  <el-input v-model="form.wechatInvoiceKey"></el-input>
                </el-form-item>
                <el-form-item label="纳税人属性：" prop="taxpayersAttrId" v-if="form.isBilling">
                  <el-select v-model="form.taxpayersAttrId" placeholder="请选择纳税人属性" popper-class="input-select">
                    <el-option :label="item.text" :value="item.taxpayersAttrId" v-for="item in texts"
                               :key="item.taxpayersAttrId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="销售方名称：" prop="sellerName" v-if="form.isBilling">
                  <el-input v-model="form.sellerName"></el-input>
                </el-form-item>
                <el-form-item label="销售方银行账号：" prop="bank" v-if="form.isBilling">
                  <el-input v-model.number="form.bank"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="button-box">
          <div class="btn-box clearfix">
            <el-button @click="cancel()">取消</el-button>
            <el-button @click="sendForm('form',false)" :disabled="isDisabled" :class="{'disabledBtn':isDisabled}">保存并继续</el-button>
            <el-button class="save saasbtn-primary saasbtn-primary:hover " type="primary"
                       :disabled="isDisabled"
                       @click="submitForm('form',true)"
                       :class="{'disabledBtn':isDisabled}">
              保存
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
      this.getCode()
      if (this.id > 0) {
        this.getDataById()
      }
    },
    data () {
      return {
        id: this.$store.state.cacheData.id,
        texts: [],
        isShow: false,
        fileList: [],
        isValid: false,
        labelPosition: 'left',
        form: {
          legalPerName: '',
          isBilling: true,
          invoiceName: '',
          taxRate: '',
          certificateUrl: '',
          certificatePwd: '',
          dockingMerchants: 1,
          cnpj: '',
          sellerNumber: '',
          sellerAddress: '',
          legalPerCode: '',
          taxpayersAttrId: '',
          sellerName: '',
          bank: '',
          remark: '',
          wechatPartyId: '',
          wechatInvoiceKey: '',
          id: ''
        },
        rules: {
          legalPerName: [
            {required: true, message: '请输入法人名称', trigger: 'blur'},
            {max: 20, message: '不得超过20个字符', trigger: 'change'}
          ],
          legalPerCode: [
            {required: true, message: '法人代码是必填项', trigger: 'blur'},
            {max: 20, message: '不得超过20个字符', trigger: 'change'}
          ],
          certificatePwd: [
            {required: true, message: '证书密码是必填项', trigger: 'blur'}
          ],
          wechatPartyId: [
            {required: true, message: '微信开票第三方id是必填项', trigger: 'blur'}
          ],
          wechatInvoiceKey: [
            {required: true, message: '微信开票密钥是必填项', trigger: 'blur'}
          ],
          invoiceName: [
            {required: true, message: '发票明细是必填项', trigger: 'blur'}
          ],
          taxpayersAttrId: [
            {required: true, message: '纳税人属性是必填项', trigger: 'blur'}
          ],
          taxRate: [
            {required: true, message: '税率是必填项', trigger: 'blur'},
            {type: 'number', message: '税率是数字'}
          ],
          sellerName: [
            {required: true, message: '销售方名称是必填项', trigger: 'blur'}
          ],
          cnpj: [
            {required: true, message: '识别号是必填项', trigger: 'blur'},
            {max: 20, message: '不得超过20个字符', trigger: 'change'}
          ],
          bank: [
            {required: true, message: '销售方银行账号是必填项', trigger: 'blur'},
            {
              type: 'number', message: '银行账号是数字'
            }
          ],
          sellerNumber: [
            {required: true, message: '销售方电话是必填项', trigger: 'blur'}
          ],
          sellerAddress: [
            {required: true, message: '销售方地址是必填项', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getDataById: function () {
        let self = this
        this.$http.post('/api/organization/legalPerson/getLegalPerDetail', {id: self.id}).then(function (res) {
          if (res.data.code === '0') {
            let dataForm = res.data.data
            for (let vars in dataForm) {
              switch (vars) {
                case 'seller_name':
                  self.form.sellerName = dataForm[vars]
                  break
                case 'legal_per_code':
                  self.form.legalPerCode = dataForm[vars]
                  break
                case 'is_billing':
                  self.form.isBilling = (dataForm[vars] === '1')
                  break
                case 'remark':
                  self.form.remark = dataForm[vars]
                  break
                case 'seller_number':
                  self.form.sellerNumber = dataForm[vars]
                  break
                case 'invoice_name':
                  self.form.invoiceName = dataForm[vars]
                  break
                case 'seller_address':
                  self.form.sellerAddress = dataForm[vars]
                  break
                case 'certificate_url':
                  self.form.certificateUrl = dataForm[vars]
                  break
                case 'cnpj':
                  self.form.cnpj = dataForm[vars]
                  break
                case 'docking_merchants':
                  self.form.dockingMerchants = parseInt(dataForm[vars])
                  break
                case 'legal_per_name':
                  self.form.legalPerName = dataForm[vars]
                  break
                case 'wechat_party_id':
                  self.form.wechatPartyId = dataForm[vars]
                  break
                case 'wechat_invoice_key':
                  self.form.wechatInvoiceKey = dataForm[vars]
                  break
                case 'certificate_pwd':
                  self.form.certificatePwd = dataForm[vars]
                  break
                case 'bank':
                  self.form.bank = dataForm[vars] - 0
                  break
                case 'taxpayers_attr_id':
                  self.form.taxpayersAttrId = dataForm[vars]
                  break
                case 'tax_rate':
                  self.form.taxRate = dataForm[vars]
                  break
                case 'id':
                  self.form.id = dataForm[vars]
                  break
                default :
                  break
              }
            }
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          console.info(err)
          self.$message({
            message: '网络错误',
            type: 'error'
          })
        })
      },
      getCode: function () {
        let self = this
        this.$http.post('/api/organization/legalPerson/getComboboxByClassIdentifierCode ', {class_identifier_code: 'taxpayer_type'})
          .then(function (res) {
            if (res.data.code === '0') {
              self.texts = res.data.data
            } else {
              self.$message({
                message: res.data.msg,
                type: 'error'
              })
            }
          })
          .catch(function (err) {
            console.info(err)
            self.$message({
              message: '网络错误',
              type: 'error'
            })
          })
      },
      submitForm: function (formName, flag) {
        this.$refs[formName].validate((valid) => {
          let self = this
          if (valid) {
            this.isValid = true
            this.form.isBilling = this.form.isBilling ? 1 : 0
            this.$http.post('/api/organization/legalPerson/save', {form: this.form}).then(function (res) {
              if (res.data.code === '1002') {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code === '1003') {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code === '0') {
                self.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                self.$store.state.cacheData.sort = 'last_updatetime'
                if (flag) {
                  self.$router.push('/legalManage')
                }
              } else {
                self.$message({
                  message: '保存失败',
                  type: 'error'
                })
              }
            }).catch(function (err) {
              console.info(err)
              self.$message({
                message: '网络有误',
                type: 'error'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      sendForm: function (formName, flag) {
        this.submitForm(formName, flag)
        this.id = 0
        this.form = {
          legalPerName: '',
          isBilling: false,
          invoiceName: '',
          taxRate: '',
          certificateUrl: '',
          certificatePwd: '',
          dockingMerchants: 1,
          cnpj: '',
          sellerNumber: '',
          sellerAddress: '',
          legalPerCode: '',
          taxpayersAttrId: '',
          sellerName: '',
          bank: '',
          remark: '',
          wechatPartyId: '',
          wechatInvoiceKey: '',
          id: ''
        }
        this.resetForm(formName)
      },
      resetForm: function (formName) {
        if (this.isValid) {
          this.$refs[formName].resetFields()
        }
      },
      cancel: function () {
        this.$store.cacheData = {}
        this.$router.push('/legalManage')
      },
      radiosChange: function (ele) {
        ele === 2 ? this.isShow = true : this.isShow = false
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      handleRemove (file, fileList) {
      },
      handlePreview (file) {
      }
    },
    computed: {
      isDisabled () {
        if (this.form.isBilling) {
          return !(this.form.legalPerName && this.form.invoiceName && this.form.legalPerCode && this.form.taxpayersAttrId && this.form.sellerName && this.form.bank && this.form.taxpayersAttrId && this.form.taxRate && this.form.sellerNumber && this.form.sellerAddress && this.form.cnpj)
        } else {
          return !(this.form.legalPerName && this.form.invoiceName && this.form.legalPerCode)
        }
      }
    }
  }
</script>
<style lang="less" type="text/less">
  #editLegalManage {
    .add-main {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
      padding: 0 16px;
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
                    .el-input__inner {
                      height: 32px;
                      width: 230px;
                      font-size: 14px;
                      color: #9AABB8;
                      line-height: 14px;
                      padding: 0 0 0 8px;
                      border-radius: 3px;
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
                }
              }
              .el-form-item.is-required {
                .el-form-item__label:before {
                  position: absolute;
                  top: 17px;
                  left: -9px;
                }
              }
              .el-form-item.is-error.is-required {
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
                    width: 780px;
                    height: 72px;
                    .el-textarea__inner {
                      resize: none;
                      height: 100%;
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
</style>

