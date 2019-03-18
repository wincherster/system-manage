<style lang="less" scoped>
  @import "./editBrand.less";
</style>
<template>
  <transition name="fade">
    <div class="edit-brand-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title">{{organiza ? "编辑品牌" : "新增品牌" }}</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="tzx-form">
            <el-form :model="form" :rules="rules" ref="form" label-width="74px" label-position="left" status-icon>

              <el-form-item label="名称:" prop="brand">
                <el-input v-model="form.brand" placeholder="请输入100个以内的字符" clearable></el-input>
              </el-form-item>

              <el-form-item label="业态:" prop="format_state">
                <el-select v-model="form.format_state" clearable placeholder="请选择业态" style="width:100%" popper-class="my-popper-select-class">
                  <el-option
                    v-for="item in formatStateData"
                    :key="item.textid"
                    :label="item.text"
                    :value="item.textid">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="主营菜系:" prop="name">
                <el-input v-model="form.name"
                          placeholder="输入名称快速查找"
                          @focus="showCuisineList = true"
                          @blur="trim('name')">
                          <i slot="suffix" class="el-input__icon el-icon-circle-close el-input__clear" @click="clearCuisine"></i>
                          </el-input>
                <transition name="el-zoom-in-top">
                  <div class="selectList cuisineList" v-if="showCuisineList && cuisineOptions && cuisineOptions.length > 0">
                    <ul>
                      <li v-for="(item) in cuisineOptions"
                          :key="item.id"
                          @click="selectCuisine(item)"
                          :class="item.id === null ? 'create' : ''">
                          <span>{{ item.name }}</span>
                          <el-button type='text' v-if="item.cuisine_code === null">创建菜系</el-button>
                      </li>
                    </ul>
                  </div>
                </transition>
              </el-form-item>
              
              <el-form-item label="品牌介绍:" prop="remark" class="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="请输入1000个以内的字符" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
              </el-form-item>

              <el-form-item label="LOGO:">
                <el-upload
                  ref="logoUpload"
                  class="uploader logo-uploader"
                  :action="url"
                  :show-file-list="false"
                  name="fileToUpload"
                  :before-upload="beforeLogoUpload"
                  :on-success="handleLogoSuccess">
                  <div class="preview logo" v-if="form.logoImage" :style='"background-image: url("+form.logoImage+")"'></div>
                  <div v-else class="desc-container">
                    <i class="icon el-icon-plus avatar-uploader-icon"></i>
                    <div class="title">上传图片</div>
                    <div class="desc">建议尺寸200X200px，500K以内的png、jpg图片</div>
                  </div>
              </el-upload>
              </el-form-item>

            </el-form>
          </div>

          <div class="opt">
            <el-button @click="close()" class="kxBtn">取消</el-button>
            <el-button type="primary" @click="submit('form')" class="sxBtn" :disabled="!enabled" :class="{ 'disabledBtn': !enabled }" >确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../../assets/less/tzx-slide-right-window.css'
  import '../../../../../assets/less/tzx-form.css'
  import EventBus from '../../../../../utils/EventBus.js'

  export default {
    created () {
      // console.log('获取到的数据：', this.orgType, this.organiza, this.topOrg, this.showEditBrand)
      this.initData()
    },
    mounted () {
      if (this.showRightBody) {
        this.showBody()
      }
    },
    props: ['orgType', 'organiza', 'topOrg', 'showEditBrand'],
    data () {
      return {
        showRightBody: this.showEditBrand,
        form: {
          id: null, // 品牌ID
          brand: null, // 品牌名称
          format_state: null, // 业态ID
          name: null, // 菜系名称
          cuisine_code: null, // 菜系ID
          remark: null, // 品牌介绍
          logoImage: null // logoURL
        },
        rules: {
          brand: [
            { required: true, message: '请输入100个以内的汉字或字符', trigger: 'blur' },
            { min: 1, max: 100, message: '请输入100个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入100个以内的汉字或字符', trigger: 'change' }
          ],
          format_state: [
            { required: true, message: '请选择业态', trigger: 'change' }
          ],
          name: [ // 菜系名称 // 必填
            { min: 0, max: 20, message: '请输入20个以内的汉字或字符', trigger: 'change' },
            { whitespace: true, message: '请输入20个以内的汉字或字符', trigger: 'change' }
          ],
          remark: [
            { min: 0, max: 1000, message: '请输入1000个以内的汉字或字符', trigger: 'change' }
          ]
        },
        //
        formatStateData: [], // 业态数据
        //
        showCuisineList: false, // 显示菜系列表
        cuisineOptions: [], // 菜系选项
        cuisineData: [], // 菜系数据
        //
        url: `${process.env.API_ROOT}/organization/upload/uploadFile`
      }
    },
    methods: {
      initData () {
        if (this.organiza) {
          this.form.id = this.organiza.id
          this.form.brand = this.organiza.orgFullName
          this.form.format_state = this.organiza.formatState
          this.form.name = this.organiza.name
          this.form.cuisine_code = this.organiza.cuisineCode
          this.form.remark = this.organiza.remark
          this.form.logoImage = this.organiza.logoimage
        }

        this.getComboboxAjax()
      },
      getComboboxAjax () {
        this.$http
          .post('/api/organization/brand/getComboboxByClassIdentifierCode', {class_identifier_code: 'format_state'})
          .then(res => {
            if (res.data.code === '0') {
              // 业态初始化
              this.formatStateData = res.data.data.format_state
              // 菜系初始化
              this.cuisineData = res.data.data.cuisine
              this.cuisineOptions = res.data.data.cuisine
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      submit () { // 提交表单
        // console.log(this.form)
        this.$refs.form.validate((valid) => {
          if (valid) {
            // console.log('验证通过')
            this.submitAjax(() => {
              this.close()
              EventBus.$emit('reload')
            })
          }
        })
      },
      submitAjax (callback) {
        this.$http
          .post('/api/organization/brand/save', { form: this.form })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              callback()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      //
      clearCuisine () { // 清空菜系
        this.showCuisineList = false
        //
        this.form.cuisine_code = null
        this.form.name = null
      },
      selectCuisine (cuisine) { // 选择价格体系
        this.showCuisineList = false
        //
        this.form.cuisine_code = cuisine.cuisine_code
        this.form.name = cuisine.name
      },
      //
      beforeLogoUpload (file) { // 上传logo
        return this.beforeUpload(file, 500)
      },
      handleLogoSuccess (res, file) {
        this.uploadSuccess(res, file, url => {
          this.form.logoImage = url
        })
      },
      beforeUpload (file, limitK) { // 上传之前（公用）（KB）
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
      uploadSuccess (res, file, callback) { // res // {error: 0, url: "http://test.e7e6.net:7778/group1/M00/02/F1/wKggEFpm7rqAGTk-AADHhBgcwxw421.png"}
        // console.log('上传成功回调res=', res, 'file=', file)
        try {
          if (res.error === 0) {
            callback(res.url)
            this.$message({ type: 'success', message: '上传成功' })
          } else {
            this.$message({ type: 'error', message: '上传失败' })
          }
        } catch (error) {
          this.$message({ type: 'error', message: '上传失败' })
        }
      },
      close () { // 关闭窗口
        this.$emit('close')
        EventBus.$emit('reload')
      },
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      },
      //
      trim (field) { // form表单：去除前后导空格
        if (this.form[field] != null) {
          this.form[field] = this.form[field].trim()
        }
      }
    },
    computed: {
      name () {
        return this.form.name
      },
      enabled () {
        return this.form.brand && this.form.format_state
      }
    },
    watch: {
      name (value) {
        if (value !== null) {
          value = value.trim()
  
          this.cuisineOptions = this.cuisineData.filter(item => {
            return item.name && item.name.indexOf(value) > -1
          })
  
          let index = this.cuisineData.findIndex(item => {
            return item.name && item.name === value
          })
  
          if (index === -1 && value !== '') { // 添加价格体系
            this.cuisineOptions.push({
              id: null,
              name: value
            })
          }
        } else {
          this.cuisineOptions = this.cuisineData
        }
      }
    }
  }
</script>
<style>
.uploader.logo-uploader .el-upload.el-upload--text .desc-container .desc {
  margin-top: -40px;
}
</style>
