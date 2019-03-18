<style lang="less" scoped>
@import "./distributionDetails.less";
</style>
<template>
  <transition name="fade">
    <div class="distribution-details-container tzx-slide-right-window-container">
      <div class="body" ref="showRightBody">
        <div class="head">
          <h3 class="title">配送中心详情</h3>
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
                    <label class="label small">隶属法人:</label><div class="value nowrap">{{ organiza.legalPerName }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">启用日期:</label><div class="value nowrap">{{ organiza.setupDate != null ? (organiza.setupDate | dateFilter('2', 'YYYY-MM-DD')) : '' }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">联系人:</label><div class="value nowrap">{{ organiza.storeManagerName }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">联系电话:</label><div class="value nowrap">{{ organiza.phone }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <label class="label small">城市地区:</label><div class="value nowrap">{{ organiza.regionName }}</div>
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
    props: ['organiza', 'showDistributionDetails'],
    created () {
    },
    mounted () {
      if (this.showRightBody) {
        this.showBody()
      }
    },
    data () {
      return {
        showRightBody: this.showDistributionDetails // 是否显示侧滑窗口
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
        EventBus.$emit('editDistribution', this.organiza)
      }
    }
  }
</script>

