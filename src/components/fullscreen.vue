<template>
  <div @click="handleChange" v-if="showFullScreenBtn" class="full-screen-btn-con">
    <i :class="value ? 'saas-header-quitfullscreen' : 'saas-button-fullscreen'" class="saas" :size="18"></i><span v-text="value ? '退出全屏' : '全屏'"></span>
  </div>
</template>
<script>
  export default {
    name: 'fullScreen',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showFullScreenBtn () {
        return window.navigator.userAgent.indexOf('MSIE') < 0
      }
    },
    methods: {
      handleFullscreen () {
        let main = document.body
        if (this.value) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (main.requestFullscreen) {
            main.requestFullscreen()
          } else if (main.mozRequestFullScreen) {
            main.mozRequestFullScreen()
          } else if (main.webkitRequestFullScreen) {
            main.webkitRequestFullScreen()
          } else if (main.msRequestFullscreen) {
            main.msRequestFullscreen()
          }
        }
      },
      handleChange () {
        this.handleFullscreen()
      }
    },
    created () {
      let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      isFullscreen = !!isFullscreen
      document.addEventListener('fullscreenchange', () => {
        this.$emit('input', !this.value)
        this.$emit('on-change', !this.value)
      })
      document.addEventListener('mozfullscreenchange', () => {
        this.$emit('input', !this.value)
        this.$emit('on-change', !this.value)
      })
      document.addEventListener('webkitfullscreenchange', () => {
        this.$emit('input', !this.value)
        this.$emit('on-change', !this.value)
      })
      document.addEventListener('msfullscreenchange', () => {
        this.$emit('input', !this.value)
        this.$emit('on-change', !this.value)
      })
      this.$emit('input', isFullscreen)
    }
  }
</script>
<style lang="less">
  .full-screen-btn-con{
    width: 100%;
    height: 100%;
    .saas{
      font-size: 12px;
      margin-left: 1px;
      vertical-align: middle;
      letter-spacing: 0;
    }
    span{
      vertical-align: middle;
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: #34495e;
      padding-left: 8px;
    }
  }
</style>
