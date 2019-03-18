<style lang="less" scoped>
  @import "./editBrandManage.less";
</style>
<template>
  <div class="brandmanage">
    <div class="shade"></div>
    <div class="add-box">
      <div class="add-header">
        <h3 class="clearfix">
          {{this.itemdata.id > 0 ? '编辑' : '新增'}}品牌
          <i class="saas saas-nav-closehover" @click="cancel(false)" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="add-body">
        <div class="add-main">
          <div class="form-container">
            <el-form :label-position="labelPosition" :model="form" label-width="74px" ref="form" :rules="rules">
              <el-form-item label="名称：" prop="brand">
                <el-input v-model="form.brand" placeholder="文字长度不得大于20个汉字"
                          @blur="trim('brand')"></el-input>
              </el-form-item>
              <el-form-item label="业态：" prop="format_state">
                <el-select v-model="form.format_state" placeholder="请选择业态" popper-class="input-select">
                  <el-option :label="format.text" :value="format.textid" v-for="format in format_states"
                             :key="format.textid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主营菜系:" prop="name">
                <el-input v-model="form.name"
                          placeholder="请选择菜系"
                          @focus="showCuisine_codeList = true"
                          @blur="trim('name');showCuisine_codeList = false">
                  <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear"
                     @click="clearCuisine"></i>
                </el-input>
                <transition name="el-zoom-in-top">
                  <div class="selectList cuisineList"
                       v-if="showCuisine_codeList && cuisine_codes && cuisine_codes.length > 0">
                    <ul>
                      <li v-for="(item) in cuisine_codes"
                          :key="item.id"
                          @click="selectCuisine(item)"
                          :class="item.id === null ? 'create' : ''">
                        <span>{{ item.name }}</span>
                        <el-button type='text' v-if="item.id === null">创建新菜系</el-button>
                      </li>
                    </ul>
                  </div>
                </transition>
              </el-form-item>
              <el-form-item label="品牌介绍：" class="brandmsg" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="文字长度不得大于500个汉字">
                </el-input>
              </el-form-item>
              <el-form-item label="LOGO:" class="LOGO">
                <div class="logo-box">
                  <el-upload
                    ref="logoUpload"
                    class="uploader logo-uploader"
                    :action="url"
                    :show-file-list="false"
                    name="fileToUpload"
                    :before-upload="beforeLogoUpload"
                    :on-success="handleLogoSuccess">
                    <div class="preview logo" v-if="form.logoImage"
                         :style='"background-image: url("+form.logoImage+")"'></div>
                    <div v-else class="desc-container">
                      <i class="icon el-icon-plus avatar-uploader-icon"></i>
                      <div class="title">上传图片</div>
                      <div class="desc">建议尺寸200*200不大于500k的png或者jpg图片</div>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel(false)">取消</el-button>
              <el-button class="save saasbtn-primary saasbtn-primary:hover"
                         :class="{'disabledBtn':!(form.brand && form.format_state)}" type="primary"
                         :disabled="!(form.brand && form.format_state)"
                         @click="submitForm('form')">
                确定
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
    props: ['itemdata'],
    created () {
      let self = this
      this.$http.post('/api/organization/brand/getComboboxByClassIdentifierCode', {class_identifier_code: 'format_state'})
        .then(function (res) {
          try {
            if (res.data.code === '0') {
              self.allCuisineCode = self.cuisine_codes = res.data.data.cuisine
              self.format_states = res.data.data.format_state
              if (self.itemdata.id) {
                self.form.id = self.itemdata.id
                self.form.brand = self.itemdata.org_full_name
                self.form.format_state = self.itemdata.format_state
                self.form.name = self.itemdata.name || null
                self.form.cuisine_code = self.itemdata.cuisine_code || null
                self.form.remark = self.itemdata.remark || null
                self.form.logoImage = self.itemdata.logoimage || null
              }
            }
          } catch (error) {
            console.log(error)
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
    data () {
      return {
        labelPosition: 'left',
        format_states: [],
        cuisine_codes: [],
        allCuisineCode: [],
        showCuisine_codeList: false,
        url: `${process.env.API_ROOT}/organization/upload/uploadFile`,
        form: {
          brand: null,
          format_state: null,
          cuisine_code: null,
          remark: null,
          logoImage: null,
          name: null,
          id: null
        },
        rules: {
          brand: [
            {required: true, message: '名称是必填项', trigger: 'blur'},
            {max: 20, message: '长度不得超过20个字符', trigger: 'change'}
          ],
          format_state: [
            {required: true, message: '业态是必填项', trigger: 'blur'}
          ],
          name: [
            {max: 20, message: '长度不得超过20个字符', trigger: 'change'}
          ],
          remark: [
            {max: 500, message: '长度不得超过500个字符', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        let self = this
        console.log(self.form)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/api/organization/brand/save', {
              form: self.form
            }).then(function (res) {
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
      cancel: function (flag) {
        this.$emit('close', flag)
      },
      beforeLogoUpload (file) {
        return this.beforeUpload(file, 500)
      },
      handleLogoSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.form.logoImage = url
        })
      },
      beforeUpload (file, limitK) {
        const isJPGPNG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLtLimit = file.size < limitK * 1024
        if (!isJPGPNG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!')
        }
        if (!isLtLimit) {
          this.$message.error(`上传图片大小不能超过 ${limitK}K!`)
        }
        return isJPGPNG && isLtLimit
      },
      uploadSuccess (res, file, callback) {
        console.log('上传成功回调res=', res, 'file=', file)
        try {
          if (res.error === 0) {
            callback(res.url)
            this.$message({type: 'success', message: '上传成功'})
          } else {
            this.$message({type: 'error', message: '上传失败'})
          }
        } catch (error) {
          this.$message({type: 'error', message: '上传失败'})
        }
      },
      clearCuisine () {
        this.showCuisine_codeList = false
        this.form.cuisine_code = null
        this.form.name = null
      },
      selectCuisine (cuisine) {
        console.log(cuisine)
        this.form.cuisine_code = cuisine.cuisine_code
        this.form.name = cuisine.name
        this.showCuisine_codeList = false
      },
      trim (field) {
        if (this.form[field] != null) {
          this.form[field] = this.form[field].trim()
        }
      }
    },
    computed: {
      name () {
        return this.form.name
      }
    },
    watch: {
      name (value) {
        if (value !== null && value !== undefined) {
          value = value.trim()
          this.cuisine_codes = this.allCuisineCode.filter(item => {
            return item.name && item.name.indexOf(value) > -1
          })
          let index = this.allCuisineCode.findIndex(item => {
            return item.name && item.name === value
          })
          if (index === -1 && value !== '') {
            this.cuisine_codes.push({
              id: null,
              name: value
            })
          }
        } else {
          this.cuisine_codes = this.allCuisineCode
        }
      }
    }
  }
</script>
<style lang="less" type="text/less">
  .brandmanage {
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
            .el-textarea__inner {
              resize: none;
              height: 70px;
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
      .el-form-item.brandmsg {
        .el-form-item__label {
          padding: 37px 0;
        }
        .el-form-item__content {
          height: 94px;
          padding: 8px 0;
          .el-textarea {
            .el-textarea__inner {
              height: 78px;
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
      .el-form-item.LOGO {
        .el-form-item__label {
          padding: 37px 0;
        }
        .el-form-item__content {
          height: 96px;
          padding: 8px 0;
          width: 230px;
          .logo-box {
            width: 100%;
            height: 100%;
            .uploader {
              background: #FBFEFF;
              border: 1px dashed #D8E5EC;
              border-radius: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }
            .uploader:hover {
              border-color: #0C9AFF;
            }
            .uploader.logo-uploader {
              width: 80px;
              min-width: 80px;
              max-width: 80px;
              height: 80px;
              min-height: 80px;
              max-height: 80px;
            }
            .uploader.logo-uploader .el-upload.el-upload--text .desc-container .desc {
              position: absolute;
              top: 50%;
              left: 90px;
              margin-top: -9px;
            }
            .uploader.carousel-uploader {
              width: 375px;
              min-width: 375px;
              max-width: 375px;
              height: 85px;
              min-height: 85px;
              max-height: 85px;
            }
            .uploader.wxStoreBg-uploader {
              width: 375px;
              min-width: 375px;
              max-width: 375px;
              height: 126px;
              min-height: 126px;
              max-height: 126px;
            }

            .uploader .desc-container {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            .el-upload.el-upload--text {
              display: block;
              width: 100%;
              height: 100%;
            }
            .el-upload.el-upload--text .preview {
              width: 100%;
              height: 100%;
              display: block;
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center center;
            }
            .el-upload.el-upload--text i {
              font-size: 20px;
              color: #9AABB8;
              vertical-align: middle;
            }

            .el-upload.el-upload--text div {
              font-family: "PingFangSC-Regular", "微软雅黑";
              font-size: 12px;
              line-height: 18px !important;
            }
            .el-upload.el-upload--text div.title {
              color: #243546;
              margin-top: 7px;
            }
            .el-upload.el-upload--text div.desc {
              color: #A5B0B7;
              margin-top: 7px;
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
            bottom: -6px;
          }
        }
      }
    }
    .el-form .el-form-item .selectList {
      background-color: #fff;
      position: absolute;
      left: 0;
      z-index: 1;
      width: 100%;
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
  }
</style>


