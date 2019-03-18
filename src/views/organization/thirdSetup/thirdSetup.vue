<template>
  <div class="main-container" id="thirdSetup">
    <iframe :src="thirdUrl"></iframe>
  </div>
</template>
<script>
  export default {
    name: 'thirdSetup',
    props: [],
    created () {
      this.thirdUrl = `${process.env.API_ROOT}/finter/PaymentSettingVm/main`
    },
    data () {
      return {
        thirdUrl: ''
      }
    }
  }
</script>
<style type='text/less' lang='less' scoped>
  @import "./thirdSetup.less";
</style>
