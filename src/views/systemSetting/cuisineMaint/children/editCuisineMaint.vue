<style lang="less" scoped>
  @import "./editCuisineMaint.less";
</style>
<template>
  <div class="cuisineMaint">
    <div class="shade"></div>
    <div class="add-box">
      <div class="add-header">
        <h3 v-if="form.id == undefined">
          新增菜系
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
        <h3 v-else>
          编辑菜系
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="add-body">
        <div class="add-main">
          <div class="form-container">
            <el-form :label-position="labelPosition" label-width="74px" :model="form" ref="form" :rules="rules">
              <el-form-item label="菜系名称" prop="name">
                <el-input v-model="form.name" placeholder="文字长度不得大于20个汉字或字符"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remark" placeholder="文字长度不得大于500个汉字"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button class="save saasbtn-primary saasbtn-primary:hover" :class='{"disabledBtn" : !form.name}'
                         type="primary" :disabled="!form.name"
                         @click="submitForm('form')">确定
              </el-button>
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
      if (this.rowdata) {
        this.form.name = this.rowdata.name
        this.form.remark = this.rowdata.remark
        this.form.id = this.rowdata.id
      }
    },
    data () {
      return {
        labelPosition: 'left',
        form: {
          name: '',
          remark: ''
        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {max: 20, message: '长度不得超过20个汉字或字符', trigger: 'change'}
          ],
          remark: [{max: 500, message: '长度不得超过500个字符', trigger: 'change'}]
        }
      }
    },
    methods: {
      submitForm (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/cuisine/maintain/save', {form: this.form}).then(function (res) {
              if (res.data.code === '0') {
                self.$message({
                  message: '菜系保存成功',
                  type: 'success'
                })
                self.cancel()
              } else if (res.data.code === '1') {
                self.$message({
                  message: '信息有误',
                  type: 'error'
                })
              } else if (res.data.code === '2') {
                self.$message({
                  message: '菜系的名称已经存在',
                  type: 'warning'
                })
              } else if (res.data.code === '3') {
                self.$message({
                  message: '菜系的编码已经存在',
                  type: 'warning'
                })
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
            return false
          }
        })
      },
      cancel: function () {
        this.$emit('close')
        this.form = {}
      },
      close: function () {
        this.$emit('close')
        this.form = {}
      }
    },
    props: ['rowdata']
  }
</script>
<style lang="less">
  .cuisineMaint {
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
            height: 78px;
            .el-textarea__inner {
              resize: none;
              height: 78px;
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

