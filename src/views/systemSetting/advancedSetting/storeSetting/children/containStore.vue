<template>
  <div class="contain-store">
      <div class="content">
        <!-- 头部 -->
        <h2>
          {{storeSubmit.class_item}}{{storeSubmit.class_identifier}}所含门店
          <span class="saas saas-nav-closehover close" @click="close"></span>
        </h2>
        <!-- 内容 -->
        <div class="main">
          <div class="main-inner">
            <el-tree
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              highlight-current
              :indent='20'
              :render-content="renderContent"
              ref="containStoreTree">
            </el-tree>
          </div>
        </div>
        <!-- 底部 -->
        <div class="total">所含门店合计：{{storeSubmit.count}}家</div>
      </div>
  </div>
</template>
<script>
export default {
  props: ['storeSubmit'],
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'orgFullName'
      }
    }
  },
  created () {
    this.getStoreTree()
  },
  methods: {
    renderContent (h, { node, data, store }) {
      // console.log(node)
      var currentTotal, parentTotal
      currentTotal = this.getTotalItem(node)
      parentTotal = node.data.total
      return (
        <span style="font-size:14px">
          {node.data.orgFullName}
          <span>{node.level !== 1 && node.level !== 2 && node.childNodes.length === 0 ? '' : '（' + currentTotal + '/' + parentTotal + '）'}</span>
        </span>
      )
    },
    getTotalItem (node) {
      var total = 0
      var circle = function (node) {
        if (node.level !== 1 && node.level !== 2 && node.childNodes.length === 0) {
          total += 1
        } else {
          node.childNodes.forEach((item, i) => { circle(item) })
        }
      }
      circle(node)
      return total
    },
    getStoreTree () {
      var params = null
      if (this.storeSubmit.class_identifier === '经营方式') {
        params = {manage_type: this.storeSubmit.id}
      } else if (this.storeSubmit.class_identifier === '店面级别') {
        params = {storelevel: this.storeSubmit.id}
      } else if (this.storeSubmit.class_identifier === '地区级别') {
        params = {arealevel: this.storeSubmit.id}
      }

      var self = this
      this.$http.post('/api/organization/organ/getAdvancedSetTree', params)
      .then(function (res) {
        if (res.data.code === '0') {
          var data = []
          data[0] = res.data.data
          self.treeData = data
        }
      })
      .catch(function (err) {
        self.$message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    cancel () {
      this.$emit('close')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
.contain-store{
  .el-tree-node__expand-icon.is-leaf {
    color: #c0c4cc;
    cursor: default;
    width: 24px;
    text-align: center;
  }
  .el-tree-node__expand-icon.is-leaf:before {
      content: "·";
      font-size:16px;
      font-weight: 900;
  }
}
</style>

<style lang='less' scoped>
    @import './containStore.less';
</style>


