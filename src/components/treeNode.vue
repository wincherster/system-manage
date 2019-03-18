<template>
    <div>
       <el-row>
          <el-col :span="6">
            <span @click="zhankai">展开</span><span @click="guanbi">关闭</span>
          </el-col>
          <el-col :span="18">
            <el-input placeholder="请输入" v-model="filterTextNode"></el-input>
          </el-col>
      </el-row>
      <el-tree v-if="isShowTree"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :render-content="renderContent">
      </el-tree>
      <el-dialog title="节点名称" :visible.sync="dialogFormVisible" width="200px">
            <el-input v-model="formName" auto-complete="off" :label-width="formLabelWidth" placeholder="请输入节点"></el-input>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="closeMessageBox" v-if="closeButtonOne">确 定</el-button>
              <el-button type="primary" @click="editMessageBox" v-if="closeButtonTwo">确 定</el-button>
            </div>
      </el-dialog>
    </div>
</template>
<script>
  let id = 1000
  export default {
    watch: {
      filterTextNode (val) {
        this.$refs.tree.filter(val)
      }
    },
    data () {
      return {
        treeData: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        formName: '',
        formLabelWidth: '50px',
        data: '',
        node: '',
        closeButtonOne: false,
        closeButtonTwo: false,
        filterTextNode: '',
        isShowTree: true
      }
    },
    methods: {
      zhankai () {
        this.isShowTree = true
      },
      guanbi () {
        this.isShowTree = false
      },
      append () {
        if (this.formName === '' && !this.formName) {
          return false
        }
        let data = this.data
        const newChild = { id: id++, label: this.formName, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        this.data = ''
        this.formName = ''
      },
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      bj (node, data) {
        this.closeButtonTwo = true
        this.closeButtonOne = false
        this.data = data
        this.node = node
        this.formName = node.data.label
        this.dialogFormVisible = true
      },
      closeMessageBox () {
        this.dialogFormVisible = false
        this.closeButtonOne = false
        this.append()
      },
      editMessageBox () {
        if (this.formName === '' && !this.formName) {
          this.closeButtonOne = false
          this.dialogFormVisible = false
          this.closeButtonTwo = false
          return false
        }
        this.node.data.label = this.formName
        this.formName = ''
        this.data = ''
        this.node = ''
        this.closeButtonTwo = false
        this.dialogFormVisible = false
      },
      zj (data) {
        this.closeButtonOne = true
        this.dialogFormVisible = true
        this.closeButtonTwo = false
        this.data = data
      },
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      renderContent (h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.zj(data) }>增加</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.bj(node, data) }>编辑</el-button>
              <el-button style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>)
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
