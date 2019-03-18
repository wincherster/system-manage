<style lang="less" scoped>
  @import "./legalstore.less";
</style>
<template>
  <transition name="fade">
    <div class="legalstore-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title"><div>法人&nbsp;{{ name }}</div><div>&nbsp;所含机构</div></h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <el-tree
            class='organiza-tree'
            default-expand-all
            :data='organizaTreeData'
            :props='defaultProps'
            ref='organizaTree'>
          </el-tree>
        </div>
        <div class="statistics">
            所含机构：{{ count }}人
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../assets/less/tzx-slide-right-window.css'
  export default {
    mounted () {
      if (this.slideRightBody) {
        this.showBody()
      }
    },
    data () {
      return {
        slideRightBody: this.showLegalStore,
        organizaTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'orgfullname'
        }
      }
    },
    created () {
      this.initData()
    },
    props: ['id', 'name', 'count', 'showLegalStore'],
    methods: {
      submit () {
      },
      initData () {
        this.getOrganizaTreeAjax()
      },
      getOrganizaTreeAjax () {
        this.$http
          .post('/api/organization/legalPerson/getTree', { id: this.id })
          .then(res => {
            try {
              if (res.data.code === '0') {
                this.organizaTreeData = [res.data.data]
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              this.$message({ type: 'error', message: '获取机构树失败' })
              console.log(error)
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      close () {
        this.$emit('close')
      },
      showBody () {
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      }
    }
  }
</script>

