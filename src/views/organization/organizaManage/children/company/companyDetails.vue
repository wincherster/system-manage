<style lang="less" scoped>
@import "./companyDetails.less";
</style>
<template>
  <transition name="fade">
    <div class="company-details-container tzx-slide-right-window-container">
      <div class="body" ref="showRightBody">
        <div class="head">
          <h3 class="title">分公司详情</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>

        <div class="main">
         
          <div class="tzx-detail-container">

            <div class="group">
              <div class="content">
                <div class="row">
                  <div class="col">
                    <label class="label small">上级机构:</label><div class="value nowrap">{{ organiza.fatherName }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">机构名称:</label><div class="value nowrap">{{ organiza.orgFullName }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">机构编码:</label><div class="value nowrap">{{ organiza.organCode }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">机构简称:</label><div class="value nowrap">{{ organiza.orgShortName }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">备注:</label>
                    <div class=" value remark">{{ organiza.remark }}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>  
          
          <div class="opt">
            <el-button class="kxBtn" @click="close">返回</el-button>
            <el-button type="primary" class="sxBtn" @click="edit">编辑</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../../assets/less/tzx-slide-right-window.css'
  import '../../../../../assets/less/tzx-details.css'
  import EventBus from '../../../../../utils/EventBus.js'
  export default {
    props: ['organiza', 'showCompanyDetails'],
    created () {
    },
    mounted () {
      if (this.showRightBody) {
        this.showBody()
      }
    },
    data () {
      return {
        showRightBody: this.showCompanyDetails // 是否显示侧滑窗口
      }
    },
    methods: {
      showBody () { // 显示body
        this.$refs.showRightBody.style.right = 0
        this.$refs.showRightBody.style.opacity = 1
      },
      close: function () {
        this.$emit('close')
      },
      edit () {
        this.close()
        EventBus.$emit('editCompany', this.organiza)
      }
    }
  }
</script>

