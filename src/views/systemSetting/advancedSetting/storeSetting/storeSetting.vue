<template>
  <div class="storesetting-outer">
    <!-- 新增和搜索部分 -->
    <div class="top clearfix" v-if="hasAuthoritys.indexOf('101004004001001') > -1">
      <button type="button" class="saasbtn saasbtn-newadd newadd" @click="addData">
        <i class="saas saas-button-add saasbtn-icon-newadd"></i>新增
      </button>
    </div>
    <!-- 下边部分 -->
    <div class="bottom">
      <!-- 树形结构 -->
      <div class="tree-view">
        <el-tree :data="treedata" :props="defaultProps"
                 node-key='id' @node-click="handleNodeClick"
                 highlight-current ref="storeSettingTree">
        </el-tree>
      </div>
      <div class="shadow"></div>
      <!-- 表格 -->
      <div class="table">
        <div class="table-inner tzx-table-container">
          <!-- 经营方式 -->
          <el-table :data="tableData" ref="multipleTable" tooltip-effect="light"
                    @row-dblclick="checkData" current-row-key="id" highlight-current-row empty-text=" "
                    @filter-change="filterchange" @sort-change="sortChange">
            <el-table-column prop="class_item_code" label="编码" show-overflow-tooltip sortable='custom' min-width="100">
            </el-table-column>
            <el-table-column prop="class_item" label="名称" show-overflow-tooltip min-width="120">
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip show-overflow-tooltip min-width="140">
            </el-table-column>
            <el-table-column label="所含门店" align="center" min-width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.count == 0">0</div>
                <el-tooltip effect="dark" content="点击查看门店列表" placement="bottom" v-else>
                  <el-button size="small" type="text" @click="checkStore(scope.row)">{{scope.row.count}}家</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="valid_state" label="状态" align="center"
                             :filters="[{ text: '有效', value: '1' }, { text: '停用', value: '0' }]"
                             column-key="stateTitle" :filter-multiple="false"
                             filter-placement="bottom-end" width="120">
              <template slot-scope="scope">
                <el-tag :type="scope.row.valid_state === '1' ? 'success' : 'danger'" close-transition>
                  {{scope.row.valid_state === '1' ? "有效" : "停用"}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="150" fixed="right"
                             v-if="hasAuthoritys.indexOf('101004004001002') > -1 || hasAuthoritys.indexOf('101004004001003') > -1 ||hasAuthoritys.indexOf('101004004001004') > -1">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="handleEdit(scope.row)"
                           v-if="hasAuthoritys.indexOf('101004004001002') > -1">编辑
                </el-button>
                <el-button size="small" type="text" @click="handleStart(scope.row)"
                           v-if="hasAuthoritys.indexOf('101004004001003') > -1">
                  {{scope.row.valid_state === '1' ? "停用" : "启用"}}
                </el-button>
                <el-button size="small" type="text" @click="handleDelete(scope.row)"
                           v-if="hasAuthoritys.indexOf('101004004001004') > -1">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tzx-pagination-container pagination-block clearfix">
            <el-pagination class="fl-right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listCurrentPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listPageSize"
                           layout="prev, pager, next, total, jumper, sizes" :total="listTotal" prev-text="上一页"
                           next-text="下一页"
                           :background="true"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <editStoreSetting v-if="showStoreSetting" :addEditDetails="storeParams"
                      v-on:close="closeEditStoreSetting"></editStoreSetting>
    <storeSettingDetails v-if="showStoreSettingDetails" :checkDetails="storeParams"
                         v-on:close="closeStoreSettingDetails"></storeSettingDetails>
    <containStore v-if='showContainStore' :storeSubmit="storeParams" v-on:close="closeContainStore"></containStore>
  </div>
</template>
<script>
  import editStoreSetting from './children/editStoreSetting.vue'
  import storeSettingDetails from './children/storeSettingDetails.vue'
  import containStore from './children/containStore.vue'
  import '../../../../assets/less/tzx-table-pagination.css'

  export default {
    data () {
      return {
        showStoreSetting: false,
        showStoreSettingDetails: false,
        showContainStore: false,
        input: '',
        select: '',
        treedata: [
          {label: '经营方式', id: 1},
          {label: '店面级别', id: 2},
          {label: '地区级别', id: 3}
        ],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id'
        },
        tableData: [],
        storeParams: '',
        listCurrentPage: 1,
        listPageSize: 10,
        listTotal: 0,
        class_identifier: '经营方式',
        validState: '',
        order: ''
      }
    },
    created () {
      this.fetchData()
    },
    mounted () {
      this.$refs.storeSettingTree.setCurrentKey(1)
    },
    methods: {
      // 排序
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
      // 状态选择
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
        this.class_identifier = data.label
        this.listCurrentPage = 1
        this.listPageSize = 10
        this.fetchData()
      },
      /* 停用/启用操作 */
      handleStart (row) {
        if (row.valid_state === '1') {
          this.isPause('/api/store/stores/stop', row)
        } else {
          this.isPause('/api/store/stores/start', row)
        }
      },
      // 停用启用请求
      isPause (url, row) {
        var self = this
        self.$http.post(url, {'id': row.id})
          .then(function (res) {
            if (res.data.code === '0') {
              self.fetchData()
              self.$message({
                message: res.data.msg,
                type: 'success'
              })
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
      // 删除操作
      handleDelete (row) {
        let self = this
        if (row.count === 0) {
          self.$confirm('您确认要删除此' + self.class_identifier + '？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                done()
                // 请求数据
                self.$http.post('/api/store/stores/delete', {
                  'id': row.id,
                  'class_identifier': this.class_identifier
                })
                  .then(function (res) {
                    if (res.data.code === '0') {
                      self.fetchData()
                      self.$message({
                        message: '此' + self.class_identifier + '已删除',
                        type: 'success'
                      })
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
              } else {
                done()
              }
            }
          })
            .catch(() => {
              self.$message({
                message: '已取消删除',
                type: 'info'
              })
            })
        } else {
          const h = this.$createElement
          self.$msgbox({
            title: '',
            message: h('div', null, [
              h('p', null, '此' + self.class_identifier + '被引用，不能删除！')
            ]),
            type: 'info',
            confirmButtonText: '知道了',
            confirmButtonClass: 'saasbtn saasbtn-default',
            showClose: false
          })
        }
      },
      // 双击查看
      checkData (row, event) {
        if (this.hasAuthoritys.indexOf('101004004001005') > -1) {
          this.storeParams = row
          this.showStoreSettingDetails = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closeStoreSettingDetails (isEdit) {
        this.showStoreSettingDetails = false
        if (isEdit) {
          if (isEdit === '查看所含门店') {
            this.checkStore(this.storeParams)
          } else {
            this.handleEdit(isEdit)
          }
        }
      },
      // 查看门店
      checkStore (row) {
        if (this.hasAuthoritys.indexOf('101004004001005') > -1) {
          this.storeParams = row
          this.showContainStore = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closeContainStore () {
        this.showContainStore = false
      },
      // 编辑
      handleEdit (row) {
        this.storeParams = row
        this.showStoreSetting = true
      },
      // 新增
      addData () {
        this.storeParams = {class_identifier: this.class_identifier}
        this.showStoreSetting = true
      },
      closeEditStoreSetting (isRefresh) {
        this.showStoreSetting = false
        if (isRefresh === '新增') {
          this.listCurrentPage = 1
          this.fetchData()
        } else if (isRefresh === '编辑') {
          this.fetchData()
        }
      },
      // 请求数据方法
      fetchData () {
        // this.listTotal = 100
        // this.tableData = [
        //   {
        //     'valid_state': '1',
        //     'class_item_code': '003',
        //     'class_item': '商业区店',
        //     'count': 1,
        //     'id': 731,
        //     'remark': '备注信息',
        //     'class_identifier': '地区级别'
        //   }
        // ]

        var self = this
        this.$http.post('/api/store/stores/queryAll', {
          'class_identifier': this.class_identifier,
          'valid_state': this.validState,
          'order': this.order,
          'pageSize': this.listPageSize,
          'currentPage': this.listCurrentPage
        })
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
    },
    components: {
      'editStoreSetting': editStoreSetting,
      'storeSettingDetails': storeSettingDetails,
      'containStore': containStore
    },
    computed: {
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101004004001') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./storeSetting.less";
</style>
