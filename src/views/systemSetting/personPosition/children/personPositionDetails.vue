<style lang="less" scoped>
  @import "./personPositionDetails.less";
</style>
<template>
  <div class="personPositiondetails">
    <div class="shade"></div>
    <div class="check-box">
      <div class="check-header">
        <h3 class="clearfix">
          职位详情
          <i class="el-icon-close" @click="close" style="cursor:pointer;"></i>
        </h3>
      </div>
      <div class="check-body">
        <div class="check-main">
          <div class="content">
            <p>职位名称：<span>{{rowdata.class_item}}</span></p>
            <p>职位编码：<span>{{rowdata.class_item_code}}</span></p>
            <p>备注：<span class="info">{{rowdata.remark}}</span></p>
            <p>职位人员：
              <el-popover
                ref="popover1"
                popper-class="tipPop" placement="bottom"
                title=""
                width="100"
                trigger="hover"
                content="点击查看人员详情">
              </el-popover>
              <span v-popover:popover1 v-if="num>0" class="showTip" @click="toList">
                {{num + '人'}}
              </span>
              <span v-else> 0 </span>
            </p>
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
    created () {
      this.num = this.rowdata.employeeCount
    },
    data () {
      return {
        num: 0
      }
    },
    methods: {
      edit: function () {
        this.$emit('close', true, this.rowdata)
      },
      cancel: function () {
        this.$emit('close')
      },
      close: function () {
        this.$emit('close')
      },
      toList: function () {
        this.$emit('list', true, this.rowdata)
      }
    },
    props: ['rowdata']

  }
</script>
