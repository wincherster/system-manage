<style lang="less" scoped>
  @import "./specialInstruction.less";
</style>
<template>
  <transition name="fade">
    <div class="special-instruction-container tzx-slide-right-window-container">
      <div class="body" ref="slideRightBody">
        <div class="head">
          <h3 class="title">特殊指令</h3>
          <i class="saas iconfont saas-nav-closehover close-icon-btn" @click="close"></i>
        </div>
        <div class="main">
          <div class="tool-box">
            <span @click="expandAll" class="saas iconfont saas-expand-all">展开</span>
            <span @click="shrinkAll" class="saas iconfont saas-shrink-all">关闭</span>
          </div>
          <div class="tree-container">
            <el-tree
              ref="treeDom"
              :data="treeList"
              show-checkbox
              node-key="id"
              default-expand-all
              @check-change="handelinitInfo"
              :default-checked-keys="checkedList"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
        <div class="opt">
          <el-button @click="close()" class="kxBtn">取消</el-button>
          <el-button type="primary" @click="send" class="sxBtn">开始下发</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import '../../../../../assets/less/tzx-slide-right-window.css'

  export default {
    created () {
      this.initData()
    },
    mounted () {
      if (this.showRightBody) {
        this.showBody()
      }
    },
    props: ['organiza', 'showSpecialInstruction'],
    data () {
      return {
        showRightBody: this.showSpecialInstruction,
        defaultProps: {
          children: 'children',
          label: 'nodeName'
        },
        treeList: [],
        checkedList: [],
        id: '',
        uuid: ''
      }
    },
    methods: {
      close () { // 关闭窗口
        this.$emit('close')
      },
      showBody () { // 显示body
        this.$refs.slideRightBody.style.right = 0
        this.$refs.slideRightBody.style.opacity = 1
      },
      initData () {
        this.id = this.organiza.id
        this.uuid = this.organiza.orgUuid
        this.getListTree()
      },
      getListTree () { // 获取树形结构
        this.$http.post('/api/organization/organ/getListTree', {
          info_type: 2,
          module_code: 'organ_management'
        }).then((res) => {
          if (res.data.code === '0') {
            this.treeList = res.data.data
            this.listFind(this.treeList, this.checkedList, this)
          } else {
            this.$message({ type: 'error', message: res.data.msg })
          }
        }).catch(err => {
          this.$message({ type: 'error', message: err.msg })
        })
      },
      shrinkAll () { // 收缩树所有节点
        this.handleExpandOrShrinkTree(false)
      },
      expandAll () { // 展开树所有节点
        this.handleExpandOrShrinkTree(true)
      },
      handleExpandOrShrinkTree (isExpandAll) { // 处理展开和收起所有树节点
        let allNodes = this.$refs.treeDom.store._getAllNodes()
        for (let i = 0; i < allNodes.length; i++) {
          allNodes[i].expanded = isExpandAll
        }
      },
      listFind (tree, resList, self) { // 递归获取全部节点ID
        for (let i = 0; i < tree.length; i++) {
          let item = tree[i]
          resList.push(item.id)
          if (item.children) {
            self.listFind(item.children, resList, self)
          }
        }
      },
      handelinitInfo () { // 获取当前选中节点
        this.checkedList = this.$refs.treeDom.getCheckedKeys(true)
      },
      send () { // 下发
        this.$http
          .post('/api/organization/organ/initOrgan', {
            id: this.id,
            uuid: this.uuid,
            specialInfo: this.checkedList,
            initInfo: []
          })
          .then(res => {
            if (res.data.code === '0') {
              this.$message({ type: 'success', message: res.data.msg })
              this.close()
            } else {
              this.$message({ type: 'error', message: res.data.msg })
            }
          })
          .catch(err => {
            this.$message({ type: 'error', message: err.msg })
          })
      }
    }
  }
</script>
