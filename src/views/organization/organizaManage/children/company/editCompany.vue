<style lang="less" scoped>
  @import "./editCompany.less";
</style>
<template>
  <transition name="fade">
    <div class="edit-company-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title">{{organiza ? "编辑分公司" : "新增分公司" }}</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <el-form :model="form" :rules="rules" ref="form" label-width="74px" label-position="left" status-icon>
           
            <!-- 上级机构 -->
            <el-form-item label="上级机构:" prop="topOrgId" class="tree-select">
              <el-input placeholder="请返回选择上级机构" :readonly="true" v-model="topOrgName" ></el-input>
            </el-form-item>

            <!-- 当前新建机构名称 -->
            <el-form-item label="机构名称:" prop="orgFullName">
              <el-input v-model="form.orgFullName" placeholder="请输入40个以内的字符" clearable @focus="isExistOrgFullName=false" @blur="form.orgFullName = form.orgFullName.trim()"></el-input>
            </el-form-item>

            <!-- 当前新建机构简称 -->
            <el-form-item label="机构简称:" prop="orgShortName">
              <el-input v-model="form.orgShortName" placeholder="请输入40个以内的字符" clearable @blur="form.orgShortName = form.orgShortName.trim()"></el-input>
            </el-form-item>
            
            <el-form-item label="备注:" prop="remark" class="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入400个以内的字符" :autosize="{ minRows: 2, maxRows: 8}"></el-input>
            </el-form-item>
          </el-form>

          <div class="opt">
            <el-button @click="close()" class="kxBtn">取消</el-button>
            <el-button type="primary" @click="submit('form')" class="sxBtn">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../../assets/less/tzx-slide-right-window.css'
  import EventBus from '../../../../../utils/EventBus.js'
  export default {
    created () {
      // 初始化数据
      this.initData()
    },
    mounted () {
      if (this.showEditCompany) {
        this.showBody()
      }
    },
    props: ['orgType', 'organiza', 'topOrg', 'showEditCompany'],
    data () {
      return {
        form: {
          id: null, // 机构ID，编辑的时候有值
          //
          orgFullName: '', // 机构名称
          orgShortName: '', // 机构简称
          // organCode: '', // 机构编码
          remark: '', // 备注
          orgType: '', // 机构的类型 // 传过来 // '1' 分公司 '5' 物流分公司
          //
          topOrgId: null // 上级机构的ID
        },
        rules: {
          orgFullName: [
            { required: true, message: '请输入40个以内的字符', trigger: 'blur' },
            { min: 2, max: 40, message: '请输入40个以内的字符', trigger: 'blur' },
            { whitespace: true, message: '请输入40个以内的字符', trigger: 'blur' }
          ],
          orgShortName: [
            { min: 0, max: 40, message: '请输入40个以内的字符', trigger: 'blur' },
            { whitespace: true, message: '请输入40个以内的字符', trigger: 'blur' }
          ],
          remark: [
            { min: 0, max: 400, message: '请输入400个以内的字符', trigger: 'blur' }
          ],
          topOrgId: [
            { required: true, message: '请返回选择上级机构', trigger: 'blur' }
          ]
        },
        topLevel: null, // 上级的level
        topOrganCode: null, // 上级机构编码
        //
        topOrgName: '', // 上级机构的名称 // 只用于显示不做提交
        //
        isExistOrgFullName: false, // 机构名称是否存在
        isExistOrganCode: false, // 机构编码是否存在
        //
        defaultProps: {
          children: 'children',
          label: 'text'
        }
      }
    },
    methods: {
      initData () { // 'orgType', 'organiza', 'topOrg', 'showEditCompany'
        // console.log('传递过来的数据:', this.orgType, this.organiza, this.topOrg)
        this.form.orgType = this.orgType

        if (this.topOrg) {
          this.form.topOrgId = this.topOrg.id // 上级机构ID
          this.topOrgName = this.topOrg.orgFullName // 上级机构名称
          this.topLevel = this.topOrg.level // 上级机构的级别
          this.topOrganCode = this.topOrg.organCode // 上级机构的编码
        }

        if (this.organiza) { // 编辑的时候有效
          this.form.id = this.organiza.id
          this.form.orgFullName = this.organiza.orgFullName
          this.form.orgShortName = this.organiza.orgShortName
          this.form.organCode = this.organiza.organCode
          this.form.remark = this.organiza.remark
          this.form.orgType = this.organiza.orgType
        }

        // console.log('欲提交的数据:', this.form, this.topLevel, this.topOrganCode)
      },
      submitAjax () {
        this.$http
          .post('/api/organization/organ/save', { form: this.form, level: this.topLevel, organCode: this.topOrganCode })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              this.close()
              //
              // 添加/编辑后通知父组件重新reload
              EventBus.$emit('reload')
              //
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      submit (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.submitAjax()
          }
        })
      },
      close () { // 关闭窗口
        this.$emit('close')
      },
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      }
    }
  }
</script>
