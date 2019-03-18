<template>
  <div class="timeTask">
    <div class="shade"></div>
    <div class="myDialog">
      <h3 class="title">
        {{headerText}}
        <span class="saas saas-nav-closehover iconfont" @click="cancel()"></span>
      </h3>
      <div class="container">
        <div class="content">
          <el-form :label-position="labelPosition" label-width="74px" :model="form" ref="form" :rules="rules">
            <el-form-item label="任务名称：" prop="job_name">
              <el-input v-model="form.job_name" placeholder="文字长度不得大于20个汉字"></el-input>
            </el-form-item>
            <el-form-item label="任务类型：" prop="job_type">
              <el-select v-model="form.job_type" placeholder="请选择任务类型" popper-class="input-select">
                <el-option label="生日营销定时任务" value="1"></el-option>
                <el-option label="菜品变价生效定时任务" value="2"></el-option>
                <el-option label="供应商采购变价定时任务" value="3"></el-option>
                <el-option label="过期积分失效定时任务" value="4"></el-option>
                <el-option label="过期优惠券作废定时任务" value="5"></el-option>
                <el-option label="卡过期定时任务" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：" class="Remarks">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <button type="button" class="saasbtn saasbtn-default saasbtn-sm" @click="cancel()">取消</button>
          <button type="button" class="saasbtn saasbtn-primary saasbtn-sm" @click="submitForm('form')">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['addEdit'],
    created () {
      if (this.addEdit) {
        this.headerText = '编辑定时任务'
        this.form = this.addEdit
      } else {
        this.headerText = '新增定时任务'
      }
    },
    data () {
      return {
        headerText: '新增定时任务',
        labelPosition: 'left',
        form: {
          job_name: '',
          job_type: '',
          remark: '',
          id: 0
        },
        rules: {
          job_name: [
            {required: true, message: '名称是必填项', trigger: 'blur'},
            {min: 1, max: 20, message: '长度不得超过20个汉字', trigger: 'blur'}
          ],
          job_type: [
            {required: true, message: '编码是必填项', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid && this.form.id === 0) {
            this.$http.post('/api/task/setting/save', this.form)
            .then(function (res) {
              if (res.data.code === '0') {
                self.$emit('close', '新增')
                self.$message({
                  message: res.data.msg,
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            }).catch(function (err) {
              self.$message({
                message: err.msg,
                type: 'error'
              })
            })
          } else if (valid && this.form.id !== 0) {
            this.$http.post('/api/task/setting/update', this.form)
            .then(function (res) {
              if (res.data.code === '0') {
                self.$emit('close', '编辑')
                self.$message({
                  message: res.data.msg,
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(function (err) {
              self.$message({
                message: err.msg,
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
      },
      close: function () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less">
.timeTask{
  .el-form {
    .el-form-item {
      margin-bottom:20px;
      .el-form-item__label{
        font-size: 14px;
        color: #606266;
        line-height: 32px;
        padding: 0;
        &:before{
          margin: 0;
          margin-left:-6px;
        }
      }
      .el-form-item__content{
        line-height: 32px;
        width: 230px;
        .el-select {
          width: 230px;
        }
        .el-input{
          .el-input__inner{
            height: 32px;
            padding: 0 7px;
            background-color: #fff;
            line-height: 32px;
            border: 1px solid #D8E5EC;
            border-radius: 3px;
          }
          .el-input__suffix{
            .el-input__icon {
              line-height: 32px;
            }
          }
        }
        .el-form-item__error {
          padding-top: 0px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #FF0000;
          line-height: 17px;
          position: absolute;
          top: 100%;
          left: 7px;
        }
      }
    }
    // 验证错误时的输入框样式
    .is-error .el-form-item__content .el-input .el-input__inner{
      border-color: #FF0000;
    }
  }
}
</style>
<style lang="less" scoped>
  @import "./editTimeTask.less";
</style>
