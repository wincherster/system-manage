<template>
  <div class="coderolesetting-outer">
    <!-- 头部 -->
    <div class="top clearfix">
      <div class="search">
        <el-input placeholder="请输入名字" v-model="input" @keyup.enter.native="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="代码" popper-class="search-select">
            <el-option label="编码名称" value="编码名称"></el-option>
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
        highlight-current node-key='id' ref="coderoleTree"
        @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="shadow"></div>
      <!-- 表格 -->
      <div class="table" >
        <div class="table-inner tzx-table-container">
          <!-- 单据号编码规则 -->
          <el-table :data="tableData" style="width: 100%" ref="djhTable"
          v-show="tableShow==='单据号编码规则'" empty-text=" "
          tooltip-effect="light" highlight-current-row
          @sort-change="sortChange">
            <el-table-column prop="bill_name" label="编码名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="code_memo" label="编码规则说明" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="max_length" label="最大长度" min-width="100" sortable='custom' align="right"></el-table-column>
            <el-table-column prop="perfix_1" label="前缀1" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="perfix_2" label="前缀2" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="perfix_3" label="前缀3" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serial_length" label="流水号长度" min-width="100" align="right"></el-table-column>
            <el-table-column prop="example" label="样例" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 基础档案编码规则 -->
          <el-table :data="tableData" style="width: 100%" ref="jcdaTable"
          v-show="tableShow==='基础档案编码规则'" empty-text=" "
          tooltip-effect="light" highlight-current-row
          @sort-change="sortChange">
            <el-table-column prop="baseinfo_name" label="编码名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="max_length" label="最大长度" sortable='custom' align="right"></el-table-column>
            <el-table-column prop="static_prefix_code" label="静态固定前缀" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dyna_prefix_code" label="动态前缀" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dyna_prefix_code_name" label="动态前缀说明" show-overflow-tooltip></el-table-column>
            <el-table-column prop="serial_length" label="流水号长度" align="right"></el-table-column>
            <el-table-column prop="example" label="样例" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 资料编码方案 -->
          <el-table :data="tableData" style="width:100%" ref="zlbmTable"
          v-show="tableShow==='资料编码方案'" empty-text=" "
          tooltip-effect="light" highlight-current-row
          @sort-change="sortChange">
            <el-table-column prop="encoding_name" label="编码名称" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="max_level" label="最大级数"></el-table-column>
            <el-table-column prop="max_length" label="最大长度" sortable='custom'  align="right"></el-table-column>
            <el-table-column prop="max_single_length" label="单级最大长度" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="one_length" label="第一级长度"></el-table-column>
            <el-table-column prop="two_length" label="第二级长度"></el-table-column>
            <el-table-column prop="three_length" label="第三级长度"></el-table-column>
            <el-table-column prop="four_length" label="第四级长度"></el-table-column>
            <el-table-column prop="five_length" label="第五级长度"></el-table-column>
            <el-table-column prop="six_length" label="第六级长度"></el-table-column>
            <el-table-column prop="seven_length" label="第七级长度"></el-table-column>
            <el-table-column prop="eight_length" label="第八级长度"></el-table-column>
            <el-table-column prop="example" label="样例" show-overflow-tooltip></el-table-column>
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
        select: '编码名称',
        tableShow: '单据号编码规则',
        treedata: [
          {label: '单据号编码规则', ref: 'djhTable', id: 1},
          {label: '基础档案编码规则', ref: 'jcdaTable', id: 2},
          {label: '资料编码方案', ref: 'zlbmTable', id: 3}
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableData: [],
        listCurrentPage: 1,
        listPageSize: 10,
        listTotal: 0,
        order: '',
        djhOrder: '',
        jcdaOrder: '',
        zlOrder: ''
      }
    },
    created () {
      this.fetchData()
    },
    mounted () {
      this.$refs.coderoleTree.setCurrentKey(1)
    },
    methods: {
      sortChange (val) {
        this.order = this.chooseOrder(val)
        this.listCurrentPage = 1
        this.fetchData()
      },
      chooseOrder (val) {
        var order = ''
        if (val.order === 'ascending') {
          order = 'asc'
        } else if (val.order === 'descending') {
          order = 'desc'
        } else {
          order = ''
        }
        return order
      },
      /* 树形结构 */
      handleNodeClick (data) {
        this.$refs[data.ref].clearSort()
        this.order = ''
        this.input = ''
        this.tableShow = data.label
        this.listCurrentPage = 1
        this.listPageSize = 10
        this.fetchData()
      },
      search () {
        this.listCurrentPage = 1
        this.fetchData()
      },
      // 请求数据方法
      fetchData () {
        if (this.tableShow === '单据号编码规则') {
          this.getUrl('/api/sysbill/coderule/queryAll', {
            'bill_name': this.input,
            'order': this.order,
            'pageSize': this.listPageSize,
            'currentPage': this.listCurrentPage
          })
        } else if (this.tableShow === '基础档案编码规则') {
          this.getUrl('/api/sysbase/infocoderule/queryAll', {
            'baseinfo_name': this.input,
            'order': this.order,
            'pageSize': this.listPageSize,
            'currentPage': this.listCurrentPage
          })
        } else if (this.tableShow === '资料编码方案') {
          this.getUrl('/api/sysdata/encoding/queryAll', {
            'encoding_name': this.input,
            'order': this.order,
            'pageSize': this.listPageSize,
            'currentPage': this.listCurrentPage
          })
        }
      },
      getUrl (url, params) {
        this.tableData = []
        var self = this
        self.$http.post(url, params)
        .then(function (res) {
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
<style type="text/less" lang="less">
/*// 修改element组件的样式*/
.coderolesetting-outer  {
  /* -----------------搜索框---------------------------------------- */
  .input-with-select{
    .el-input__inner {
      height: 28px;
      padding: 0 0 0 10px;
      font-size: 12px;
    }
    // 左边
    .el-input-group__prepend{
      background-color: #fff;
      .el-select{
        .el-input {
          width: 75px;
          .el-input__inner {
            padding-right: 20px;
            padding-left: 5px;
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
    .el-input__inner{
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
    @import "./codeRoleSetting.less";
</style>
