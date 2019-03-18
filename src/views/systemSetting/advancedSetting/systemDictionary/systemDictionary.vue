<template>
  <div class="systemdictionary-outer">
    <!-- 头部 -->
    <div class="top clearfix">
      <div class="search">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select" @keyup.enter.native="search">
          <el-select v-model="select" slot="prepend" placeholder="代码" popper-class="search-select">
            <el-option label="业务模块" value="业务模块"></el-option>
            <el-option label="类别名称" value="类别名称"></el-option>
            <el-option label="类别标识" value="类别标识"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 下边 -->
    <div class="bottom">
      <!-- 树形结构 -->
      <div class="tree-view">
        <el-tree :data="treedata" :props="defaultProps"
        highlight-current node-key='id' ref="systemdictionaryTree"
        @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="shadow"></div>
      <!-- 表格 -->
      <div class="table" >
        <div class="table-inner tzx-table-container">
          <!-- 单据号编码规则 -->
          <el-table :data="tableData" ref="multipleTable" style="width: 100%"
          @filter-change="filterchange" @sort-change="sortChange" empty-text=" "
          tooltip-effect="light" highlight-current-row>
            <el-table-column prop="model_name" label="系统类型" show-overflow-tooltip></el-table-column>
            <el-table-column prop="application_model" label="隶属业务模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="class_identifier" label="类别名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="class_identifier_code" label="类别标识" show-overflow-tooltip sortable='custom'></el-table-column>
            <el-table-column prop="class_item" label="类别明细项" show-overflow-tooltip></el-table-column>
            <el-table-column prop="class_item_code" label="类别明细项标识" show-overflow-tooltip></el-table-column>
            <el-table-column prop="valid_state" label="状态" align="center" width="120"
              :filters="[{ text: '有效', value: '1' }, { text: '停用', value: '0' }]"
              column-key="stateTitle" :filter-multiple="false"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag :type="scope.row.valid_state === '1' ? 'success' : 'danger'"
                  close-transition>{{scope.row.valid_state==='1'?"有效":"停用"}}</el-tag>
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
      select: '业务模块',
      tableShow: 'scm',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      listTotal: 0,
      listCurrentPage: 1,
      listPageSize: 10,
      validState: '',
      order: '',
      application_model: '',
      class_identifier: '',
      class_identifier_code: ''
    }
  },
  created () {
    this.treedata = [
      { name: 'scm字典表', param: 'scm', id: 1 },
      { name: 'hq字典表', param: 'hq', id: 2 },
      { name: 'h1字典表', param: 'h1', id: 3 },
      { name: 'boh字典表', param: 'boh', id: 4 },
      { name: 'crm字典表', param: 'crm', id: 5 },
      { name: 'pos字典表', param: 'pos', id: 6 },
      { name: 'hq_wx字典表', param: 'hq_wx', id: 7 },
      { name: 'sys字典表', param: 'sys', id: 8 },
      { name: 'cc字典表', param: 'cc', id: 9 }
    ]
    this.fetchData()
  },
  mounted () {
    this.$refs.systemdictionaryTree.setCurrentKey(1)
  },
  methods: {
    sortChange (val) {
      if (val.order === 'ascending') {
        this.order = 'asc'
        this.listCurrentPage = 1
      } else if (val.order === 'descending') {
        this.order = 'desc'
        this.listCurrentPage = 1
      } else {
        this.order = ''
        this.listCurrentPage = 1
      }
      this.fetchData()
    },
    // 状态过滤
    filterchange (filters) {
      if (filters['stateTitle'][0]) {
        this.validState = filters['stateTitle'][0]
        this.listCurrentPage = 1
      } else {
        this.validState = ''
        this.listCurrentPage = 1
      }
      this.fetchData()
    },
    /* 树形结构 */
    handleNodeClick (data) {
      this.$refs.multipleTable.clearSort()
      this.order = ''
      this.$refs.multipleTable.clearFilter()
      this.validState = ''
      this.input = ''
      this.tableShow = data.param
      this.listCurrentPage = 1
      this.listPageSize = 10
      this.fetchData()
    },
    // 查询
    search () {
      this.listCurrentPage = 1
      this.fetchData()
    },
    // 请求数据方法
    fetchData () {
      let params = {
        model_name: this.tableShow,
        valid_state: this.validState,
        order: this.order,
        pageSize: this.listPageSize,
        currentPage: this.listCurrentPage,
        application_model: ''
      }
      if (this.select === '业务模块') {
        params = {
          model_name: this.tableShow,
          valid_state: this.validState,
          order: this.order,
          pageSize: this.listPageSize,
          currentPage: this.listCurrentPage,
          application_model: this.input
        }
      } else if (this.select === '类别名称') {
        params = {
          model_name: this.tableShow,
          valid_state: this.validState,
          order: this.order,
          pageSize: this.listPageSize,
          currentPage: this.listCurrentPage,
          class_identifier: this.input
        }
      } else if (this.select === '类别标识') {
        params = {
          model_name: this.tableShow,
          valid_state: this.validState,
          order: this.order,
          pageSize: this.listPageSize,
          currentPage: this.listCurrentPage,
          class_identifier_code: this.input
        }
      }

      var self = this
      self.$http
        .post('/api/sys/dictionarys/queryAll', params)
        .then(function (res) {
          console.info(JSON.stringify(res.data))
          if (res.data.code === '0') {
            self.listTotal = res.data.data.count
            self.tableData = res.data.data.data
          } else {
            self.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        })
        .catch(function (err) {
          self.$message({
            message: err.msg,
            type: 'error'
          })
        })
    },
    /* 分页方法 */
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
.systemdictionary-outer {
  /* ------------------------搜索框------------------------- */
  .input-with-select{
    .el-input__inner {
      height: 28px;
      padding: 0 0 0 10px;
      font-size: 12px;
      border: 1px solid #D8E5EC;
    }
    // 左边
    .el-input-group__prepend {
      background-color: #fff;
      .el-select{
        .el-input {
          width: 75px;
          .el-input__inner {
            padding-right: 20px;
            padding-left: 5px;
            color: #34495E;
            border-color: #D8E5EC;
            border: none;
          }
          // 下拉按钮
          .el-input__suffix {
            right: 0;
            .el-input__suffix-inner{
              .el-select__caret {
                font-size: 12px;
                width: 18px;
              }
            }
          }
        }
      }
    }
    // 中间输入框
    .el-input__inner {
      border-right: none;
      &:focus {
        border-color: #d8dce5;
        outline: none;
      }
      &:hover {
        border-color: #d8dce5;
      }

    }
    // 右侧搜索图标
    .el-input-group__append {
      padding: 0 8px 0 22px;
      background-color: #fff;
      &:active {
        background-color: #f5f7fa;
      }
      .el-button {
        padding:6px 8px 6px 6px;
        .el-icon-search {

        }
      }
    }
  }

}
</style>
<style lang='less' scoped>
@import "./systemDictionary.less";
</style>
