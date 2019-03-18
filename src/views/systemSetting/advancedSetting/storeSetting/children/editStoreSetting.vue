<style lang="less" scoped>
@import "./editStoreSetting.less";
</style>
<template>
  <div class="storesetting">
    <div class="shade"></div>
    <div class="myDialog">
      <h4 class="title clearfix" v-cloak>
       {{headerText}}{{form.class_identifier}}
       <span class="saas saas-nav-closehover iconfont" @click="cancel()"></span>
      </h4>
      <div class="container">
        <div class="content">
          <el-form :label-position="labelPosition" label-width="80px" status-icon
          :model="form" ref="form" :rules="rules">
            <el-form-item label="名称：" prop="class_item">
                <el-input v-model="form.class_item" placeholder="文字长度不得大于20个汉字"></el-input>
            </el-form-item>
            <el-form-item label="编码：" prop="class_item_code">
                <el-input v-model="form.class_item_code" placeholder="文字长度不得大于20个汉字"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 6, maxRows: 8}"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <button type="button" class="saasbtn saasbtn-default saasbtn-sm" @click="cancel()">取消</button><!--
          --><button type="button" class="saasbtn saasbtn-primary saasbtn-sm" @click="submitForm('form')">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['addEditDetails'],
  created () {
    if (this.addEditDetails.id || this.addEditDetails.id === 0) {
      this.headerText = '编辑'
      this.form = {
        class_identifier: this.addEditDetails.class_identifier,
        class_item: this.addEditDetails.class_item,
        class_item_code: this.addEditDetails.class_item_code,
        remark: this.addEditDetails.remark,
        id: this.addEditDetails.id
      }
    } else {
      this.headerText = '新增'
      this.form.class_identifier = this.addEditDetails.class_identifier
    }
  },
  data () {
    return {
      headerText: '新增',
      labelPosition: 'left',
      form: {
        class_identifier: '',
        class_item: '',
        class_item_code: '',
        remark: '',
        id: 0
      },
      rules: {
        class_item: [
          { required: true, message: '名称是必填项', trigger: 'blur' },
          { min: 1, max: 20, message: '长度不得超过20个汉字', trigger: 'change' }
        ],
        class_item_code: [
          { required: true, message: '编码是必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post('/api/store/stores/save', self.form)
            .then(function (res) {
              if (res.data.code === '0') {
                if (res.data.data.msg) {
                  self.$message({
                    message: res.data.data.msg,
                    type: 'error'
                  })
                } else {
                  if (self.form.id === 0) {
                    self.$emit('close', '新增')
                  } else {
                    self.$emit('close', '编辑')
                  }
                  self.$message({
                    message: res.data.msg,
                    type: 'success'
                  })
                }
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
.storesetting{
  .el-form {
    .el-form-item {
      margin-bottom:20px;
      .el-form-item__label{
        width: 70px !important;
        text-align: left;
        // vertical-align: middle;
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
        margin-left:70px!important;
        line-height: 32px;
        width: 230px;
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
