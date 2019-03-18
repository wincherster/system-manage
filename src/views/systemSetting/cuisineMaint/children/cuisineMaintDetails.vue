<style lang="less" scoped>
  @import "./cuisineMaintDetails.less";
</style>
<template>
  <div class="cuisineMaintdetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          菜系详情
          <i class="el-icon-close" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <p>菜系名称：<span>{{rowdata.data.name}}</span></p>
            <p>菜系编码：<span>{{rowdata.data.code}}</span></p>
            <p>备注：<span class="info">{{rowdata.data.remark}}</span>
            </p>
            <p>适用品牌：<span class="suit" v-for="item in rowdata.data.brandName">{{item}}</span></p>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" @click="edit">编辑</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      edit: function () {
        this.$emit('close', true, this.rowdata.data)
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      }
    },
    props: ['rowdata'],
    created () {
    }
  }
</script>

