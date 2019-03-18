<style lang="less" scoped>
  @import "./editPriceManage.less";
</style>
<template>
  <div class="pricemanage">
    <div class="shade"></div>
    <div class="add-box">
      <div class="add-header">
        <h3 v-if="!rowdata.id">
          新增价格体系
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
        <h3 v-else>
          编辑价格体系
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="add-body">
        <div class="add-main">
          <div class="form-container">
            <el-form :label-position="labelPosition" label-width="74px" :model="form" ref="form" :rules="rules">
              <el-form-item label="名称：" prop="price_system_name">
                <el-input v-model="form.price_system_name" placeholder="文字长度不得大于20个汉字"></el-input>
              </el-form-item>
              <el-form-item label="所属品牌：" prop="brand_id">
                <el-select v-model="form.brand_id" placeholder="请选择品牌" popper-class="input-select">
                  <el-option :label="brand.brandname" :value="brand.id" v-for="brand in brands"
                             :key="brand.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：" class="Remarks" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="文字长度不得大于500个汉字"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button class="save saasbtn-primary saasbtn-primary:hover " type="primary"
                         :disabled="!(form.price_system_name&&form.brand_id)"
                         :class="{'disabledBtn':!(form.price_system_name&&form.brand_id)}"
                         @click="submitForm('form')">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      if (this.rowdata.id) {
        this.form = {
          price_system_name: this.rowdata.price_system_name,
          remark: this.rowdata.remark,
          id: this.rowdata.id,
          brand_id: this.rowdata.brand_id
        }
      }
      let self = this
      this.$http.post('/api/organization/priceSystem/getCombobox', {}).then(function (res) {
        if (res.data.code === '0') {
          self.brands = res.data.data
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
    data () {
      return {
        labelPosition: 'left',
        brands: [],
        form: {
          price_system_name: '',
          remark: '',
          id: '',
          brand_id: ''
        },
        rules: {
          price_system_name: [
            {required: true, message: '名称是必填项', trigger: 'blur'},
            {min: 1, max: 20, message: '长度不得超过20个汉字', trigger: 'blur'}
          ],
          brand_id: [
            {required: true, message: '所属品牌是必填项', trigger: 'change'}
          ],
          remark: [
            {max: 500, message: '长度不得超过500个字符', trigger: 'change'}
          ]
        }
      }
    },
    props: ['rowdata'],
    methods: {
      submitForm (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/organization/priceSystem/save', {form: self.form}).then(function (res) {
              if (res.data.code === '0') {
                self.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                self.cancel(true)
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
          } else {
            return false
          }
        })
      },
      cancel: function (flag) {
        if (flag) {
          this.$emit('close', flag)
        } else {
          this.$emit('close')
        }
      },
      close: function () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less">
  .pricemanage {
    .el-form.el-form--label-left {
      width: 100%;
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
          .el-textarea {
            width: 230px;
            height: 78px;
            .el-textarea__inner {
              resize: none;
              height: 100%;
              width: 100%;
              padding: 8px;
            }
          }
          .el-select {
            .el-input.el-input--suffix {
              width: 100%;
            }
          }
        }
      }
      .el-form-item.Remarks {
        .el-form-item__label {
          padding: 47px 0;
        }
        .el-form-item__content {
          height: 114px;
          padding: 8px 0;
          .el-textarea {
            .el-textarea__inner {
              height: 98px;
              resize: none;
              width: 230px;
              font-size: 14px;
              color: #9AABB8;
              letter-spacing: 0;
              line-height: 22px;
            }
          }
        }
      }
      .el-form-item.is-required {
        .el-form-item__label::before {
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
  }
</style>
