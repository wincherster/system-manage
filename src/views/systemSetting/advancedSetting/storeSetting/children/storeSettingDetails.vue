<style lang="less" scoped xmlns:v-popover="http://www.w3.org/1999/xhtml" xmlns:v-popover="http://www.w3.org/1999/xhtml">
  @import "./storeSettingDetails.less";
</style>
<template>
  <div class="storeSettingdetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          {{checkDetails.class_identifier}}详情
          <i class="iconfont saas saas-nav-closehover" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <p>名称：<span v-text="checkDetails.class_item"></span></p>
            <p>编码：<span v-text="checkDetails.class_item_code"></span></p>
            <p>备注：<span class="info" v-text="checkDetails.remark"></span></p>
            <p>所含门店：
              <el-popover
                ref="popover1"
                popper-class="tipPop" placement="bottom"
                title=""
                width="100"
                trigger="hover"
                content="点击查看所含门店">
              </el-popover>
              <span v-popover:popover1 v-if="checkDetails.count>0" class="showTip" @click="check">
                {{checkDetails.count+'家'}}
              </span>
              <span v-else> 0 </span>
            </p>
          </div>
          <div class="button-box">
            <div class="btn-box">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" @click="edit(checkDetails.id)">编辑</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['checkDetails'],
    data () {
      return {

      }
    },
    methods: {
      edit: function () {
        this.$emit('close', this.checkDetails)
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      },
      check () {
        this.$emit('close', '查看所含门店')
      }
    }

  }
</script>

