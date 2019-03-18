<template>
  <div class="provice-outer">
    <!-- 头部 -->
    <!--<div class="top">-->
      <!--<div class="search">-->
        <!--<el-input placeholder="请输入内容" v-model="input" @keyup.enter.native="search" class="input-with-select">-->
          <!--<el-select v-model="select" slot="prepend" placeholder="代码">-->
            <!--<el-option label="区域代码" value="区域代码"></el-option>-->
            <!--<el-option label="区域名称" value="区域名称"></el-option>-->
          <!--</el-select>-->
          <!--<el-button slot="append" icon="el-icon-search" @click="search"></el-button>-->
        <!--</el-input>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 下边 -->
    <div class="bottom">
      <!-- 树形结构 -->
      <div class="tree-view">
        <div class="filter-tree">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </div>
        <div class="tree-structure">
          <el-tree :data="treeData" :props="defaultProps"
          @node-click="handleNodeClick" :filter-node-method="filterNode"
          node-key="id" :default-expanded-keys="[0]"
          accordion highlight-current ref="tree"></el-tree>
        </div>
      </div>
      <div class="shadow"></div>
      <!-- 表格 -->
      <div class="table" >
        <div class="table-inner tzx-table-container">
          <el-table :data="tableData" style="width: 100%"
          tooltip-effect="light" highlight-current-row
          @filter-change="filterchange">
            <el-table-column prop="regCode" label="区域代码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="regName" label="区域名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parentName" label="上级区域" show-overflow-tooltip></el-table-column>
            <el-table-column prop="regType" label="区域级别" show-overflow-tooltip></el-table-column>
            <el-table-column prop="regNo" label="行政区号" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="validState" label="状态" align="center"
            :filters="[{ text: '有效', value: 'Y' }, { text: '停用', value: 'N' }]"
            column-key="stateTitle" :filter-multiple="false"
            filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag :type="scope.row.validState === 'Y' ? 'success' : 'danger'"
                  close-transition>{{scope.row.validState==='Y'?"有效":"停用"}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tzx-pagination-container pagination-block clearfix">
            <el-pagination class="fl-right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="listCurrentPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listPageSize"
            layout="prev, pager, next, total, jumper, sizes" :total="listTotal" prev-text="上一页" next-text="下一页"
            :background="true"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '../../../../assets/less/tzx-table-pagination.css'
export default {
  data () {
    return {
      input: '',
      select: '区域代码',
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'regName'
      },
      tableData: [],
      nodeData: [],
      listTotal: 0,
      listCurrentPage: 1,
      listPageSize: 10,
      id: 0,
      validState: ''
    }
  },
  created () {
    this.getTreeData()
  },
  mounted () {
    this.$refs.tree.setCurrentKey(0)
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 状态筛选
    filterchange (filters) {
      if (filters['stateTitle'][0]) {
        this.validState = filters['stateTitle'][0]
      } else {
        this.validState = ''
      }
      this.fetchData()
    },
    // 树形结构过滤
    filterNode (value, data) {
      if (!value) return true
      return data.regName.indexOf(value) !== -1
    },
    // 点击树形结构
    handleNodeClick (data) {
      this.nodeData = data
      this.listCurrentPage = 1
      this.fetchData()
    },
    // 树形数据请求
    getTreeData () {
      this.treeData[0] = this.$resurce
      this.nodeData = this.$resurce
      this.fetchData()
    },
    // 处理分页
    dealPage (data) {
      var startCount = 0
      var endCount = 0
      this.listTotal = data.length
      startCount = (this.listCurrentPage - 1) * this.listPageSize
      endCount = this.listCurrentPage * this.listPageSize
      return data.slice(startCount, endCount)
    },
    // 状态匹配方法
    match (currentData) {
      var data = []
      if (this.validState !== '') {
        data = currentData.filter((item) => {
          return item.validState.indexOf(this.validState) !== -1
        })
        this.tableData = this.dealPage(data)
      } else {
        this.tableData = this.dealPage(currentData)
      }
    },
    // 表格数据请求
    fetchData () {
      // 判断节点树级别(最后一级显示自己的数据不是children的)
      if (this.nodeData.children && this.nodeData.children.length !== 0) {
        this.match(this.nodeData.children)
      } else {
        this.tableData = []
        var data = []
        data[0] = this.nodeData
        this.match(data)
      }
    },
    // 分页方法
    handleSizeChange (val) {
      this.listPageSize = val
      this.listCurrentPage = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listCurrentPage = val
      this.fetchData()
    }
  }
}
</script>
<style lang="less">
// 修改element组件的样式
.provice-outer {
  // 树形过滤
  .filter-tree .el-input {
    display: block;
    width: 230px;
    margin: 10px auto;
  }
  .filter-tree .el-input__inner {
    width: 230px;
    height: 28px;
  }
  .el-input__inner {
    height:28px;
    padding: 0 0 0 10px;
    font-size: 12px;
  }

}
</style>
<style lang="less" scoped>
    @import "./provice.less";
</style>
