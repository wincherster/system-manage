<style lang="less" scoped>
  @import "./allot.less";
</style>
<template>
  <transition name="fade">
    <div class="allot-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title"><div>法人&nbsp;{{ name }}</div><div>&nbsp;机构分配</div></h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="search-container">
            <i class='saas iconfont saas-shrink-all' @click="shrinkAll"></i>
            <i class='saas iconfont saas-expand-all' @click="expandAll"></i>
            
            <el-input placeholder="输入机构编号或名称" v-model='filterText' clearable suffix-icon="saas iconfont saas-seach">
            </el-input>
          </div>

          <div class="tree-container">
            <el-tree
              class='organiza-tree'
              show-checkbox
              default-expand-all
              :data='organizaTreeData'
              :props='defaultProps'
              :default-checked-keys="myOrganizaIdList"
              :filter-node-method='filterNode'
              node-key="id"
              ref='organizaTree'>
            </el-tree>
          </div>

          <div class="opt">
            <el-button @click="close" class="kxBtn">取消</el-button>
            <el-button type="primary" class="sxBtn" @click="submit">确定</el-button>
          </div>
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
        slideRightBody: this.showAllot,
        filterText: '',
        organizaTreeData: [], // 机构树数据
        myOrganizaIdList: [], // 我所拥有的机构ID
        defaultProps: {
          children: 'children',
          label: 'orgfullname'
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.organizaTree.filter(val)
      }
    },
    created () {
      this.initData()
    },
    props: ['id', 'name', 'showAllot'],
    methods: {
      submit () {
        this.myOrganizaIdList = this.$refs.organizaTree.getCheckedKeys()
        this.$http
          .post('/api/organization/legalPerson/distribution', { id: this.id, storeIds: this.myOrganizaIdList.join(',') })
          .then(res => {
            try {
              if (res.data.code === '0') {
                this.$message({ type: 'success', message: res.data.msg })
              } else {
                this.$message({ type: 'error', message: res.data.msg })
              }
            } catch (error) {
              this.$message({ type: 'error', message: '分配机构失败' })
              console.log(error)
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      },
      initData () { // 初始化
        this.getOrganizaTreeAndMyOrganizaIdListAjax()
      },
      getOrganizaTreeAndMyOrganizaIdListAjax () { // 获取数据
        this.$http.axios.all(
          [
            this.$http.post('/api/organization/legalPerson/getDistribution', { id: this.id }),
            this.$http.post('/api/organization/legalPerson/getTree2', { id: this.id })
          ]
        )
        .then(this.$http.axios.spread((res1, res2) => {
          try {
            if (res1.data.code === '0' && res2.data.code === '0') {
              this.myOrganizaIdList = res1.data.data
              this.organizaTreeData = [res2.data.data]
            } else if (res1.data.code !== '0') {
              this.$message({ type: 'error', message: res1.data.msg })
            } else {
              this.$message({ type: 'error', message: res2.data.msg })
            }
          } catch (error) {
            this.$message({ type: 'error', message: '机构树加载失败' })
            console.log(error)
          }
        }))
        .catch(err => {
          this.$message({ type: 'error', message: err.msg })
        })
      },
      filterNode (value, data) { // 过滤节点
        if (!value) return true
        return (data.orgfullname && data.orgfullname.indexOf(value) !== -1) || (data.organ_code && data.organ_code.indexOf(value) !== -1)
      },
      //
      shrinkAll () { // 收缩树所有节点
        this.handleExpandOrShrinkTree(false)
      },
      expandAll () { // 展开树所有节点
        this.handleExpandOrShrinkTree(true)
      },
      handleExpandOrShrinkTree (isExpandAll) { // 处理展开和收起所有树节点
        let allNodes = this.$refs.organizaTree.store._getAllNodes()
        for (let i = 0; i < allNodes.length; i++) {
          allNodes[i].expanded = isExpandAll
        }
      },
      //
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
<style>
.allot-container .body .main .tree-container .organiza-tree .el-checkbox {
  line-height: 14px!important;
}
.allot-container .body .main .tree-container .organiza-tree .el-tree-node__label{
    font-family: "PingFangSC-Regular","微软雅黑";
    font-size: 14px;
    color: #34495E;
    line-height: 14px!important;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.allot-container .body .main .tree-container .organiza-tree .el-tree-node__expand-icon {
  font-size: 14px;
}
</style>