<style lang="less" scoped>
  @import "./brandDetails.less";
</style>
<template>
  <div class="branddetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          品牌详情
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <p>名称：<span>{{itemdata.org_full_name}}</span></p>
            <p>业态：<span>{{itemdata.format_state_name}}</span></p>
            <p>主营菜系：<span>{{itemdata.name}}</span></p>
            <p>品牌介绍：<span class="info">{{itemdata.remark}}</span></p>
            <p>LOGO：<span class="logo">
              <img :src="itemdata.logoimage" alt="">
            </span></p>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" class="bj" @click="edit(true)">编辑</el-button>
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
    data () {
      return {
        data: {},
        dataInfo: {}
      }
    },
    created () {
    },
    methods: {
      edit: function (flag) {
        this.$emit('close', flag)
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

