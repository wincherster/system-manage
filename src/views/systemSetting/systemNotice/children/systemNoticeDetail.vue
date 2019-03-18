<style lang="less" scoped>
  @import "systemNoticeDetail.less";
</style>
<template>
  <div id="systemNoticeDetail">
    <div class="container">
      <div class="header">
        <el-button @click="fan">返回</el-button>
      </div>
      <div class="content">
        <h3 class="title">{{detail.noticeTitle}}</h3>
        <pre v-text="detail.noticeInfo">
      </pre>
        <div class="bottom">
          <div class="info">
            <div class="qianming">{{ detail.noticeSignature}}</div>
            <div class="time" v-if="detail.sendMode === '1'">{{ detail.entryTime | dateFilter(1, 'YYYY-MM-DD HH:mm:ss')}}
            </div>
            <div class="time" v-if="detail.sendMode === '2'">
              {{ detail.timingTime | dateFilter(1, 'YYYY-MM-DD HH:mm:ss')}}
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
      return {
        detail: {}
      }
    },
    methods: {
      fan: function () {
        this.$router.go(-1)
      }
    },
    created () {
      this.detail = this.$store.state.cacheData
    }
  }
</script>
