<template>
  <div class="main-container" id="priceManage">
    <div class="main-header">
      <div>
        <div class="selected-opt" v-if="num>0">
          <i class="el-icon-close" @click="toggleSelection()"></i>
          <span class="selected-opt-num-item">已选
        <b class="num-con" v-text="num"></b> 项</span>
        </div>
        <div class="search-box">
          <el-input v-model="search" class="input-with-select" @keyup.enter.native="getDataList">
            <el-select v-model="select" slot="prepend" popper-class="search-select">
              <el-option label="名称" value="price_system_name"></el-option>
            </el-select>
            <el-button slot="suffix" icon="el-icon-search" @click="getDataList"></el-button>
          </el-input>
        </div>
      </div>
      <div class="add-box"
           v-if="hasAuthoritys.indexOf('101002004000006') > -1 || hasAuthoritys.indexOf('101002004000001') > -1">
        <button type="button" class="copy saasbtn saasbtn-sm" style="margin-right: 10px;" @click="copyData"
                v-if="hasAuthoritys.indexOf('101002004000006') > -1">复制到
        </button>
        <copyPriceManage v-if="showCopyPrice" v-on:close="closeCopyPriceManage"
                         :selections="selections"></copyPriceManage>
        <button type="button" @click="addData({'brand_id': brand_id})" class="saasbtn saasbtn-newadd newadd"
                v-if="hasAuthoritys.indexOf('101002004000001') > -1">
          <span class="saas saas-button-add saasbtn-icon-newadd"></span>新增
        </button>
        <editPriceManage v-if="showPriceManage" v-on:close="closeEditPriceManage" :rowdata="rowdata"></editPriceManage>
        <priceDetails v-if="showPriceDetails" v-on:close="closePriceDetails" :rowdata="rowdata"
                      :activeName="activeName" v-on:list="toList"></priceDetails>
        <priceStore v-if="showPriceStore"
                    v-on:close="closePriceStore" v-on:list="toList"
                    :rowdata="rowdata"></priceStore>
      </div>
    </div>
    <div class="main-body">
      <div v-if="brandList.length ==0" class="el-table__empty-text"></div>
      <el-tabs v-else v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="item.brandname" :name="item.brandname" v-for=" item in brandList" :key="item.id">
          <el-table
            ref="multipleTable"
            :data="dataList"
            style="width: 100%;min-height: 360px"
            current-row-key="id"
            @row-dblclick="checkData"
            @selection-change="handleSelectionChange"
            @sort-change="sort"
            empty-text=" "
            tooltip-effect="islight"
            @filter-change="stateChange"
            height>
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              prop="price_system_name"
              label="名称"
              min-width="150"
              align="left"
              sortable="custom">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <div @click="checkData(scope.row)" style="overflow: hidden" class="showTip">
                    {{ scope.row.price_system_name}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              prop='valid_state'
              :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '0' }]"
              :filter-multiple="false"
              column-key="valid_state"
              align="center"
              filter-placement="bottom-start">
              <template slot-scope="scope">
                <el-tag v-if='scope.row.valid_state == 1' type="success">有效</el-tag>
                <el-tag v-else type="danger">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="storeCount"
              label="所含门店"
              width="150"
              align="center">
              <template slot-scope="scope">
                <el-popover trigger="hover" v-if="scope.row.storeCount>0" popper-class="tipPop" placement="bottom">
                  点击查看门店列表
                  <div slot="reference" class="name-wrapper">
                    <div @click="checkpriceList(scope.row)" class="showTip" style="text-align: center">{{ scope.row.storeCount + '家'}}</div>
                  </div>
                </el-popover>
                <div v-else> {{scope.row.storeCount}} </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              min-width="260"
              show-overflow-tooltip
              align="left">
            </el-table-column>
            <el-table-column
              prop="last_operator"
              label="最后修改人"
              width="160"
              show-overflow-tooltip
              align="left">
            </el-table-column>
            <el-table-column
              prop="last_updatetime"
              label="最后修改时间"
              width="240"
              align="center"
              :formatter="DateFormatter">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              v-if="hasAuthoritys.indexOf('101002004000002') > -1 && hasAuthoritys.indexOf('101002004000003') > -1 && hasAuthoritys.indexOf('101002004000004') > -1"
              width="134"
              align="center">
              <template slot-scope="scope">
                <el-button @click="addData(scope.row)" type="text" size="small"
                           v-if="hasAuthoritys.indexOf('101002004000002') > -1">编辑
                </el-button>
                <el-button style="margin-left: 6px" type="text" size="small"
                           v-if="scope.row.valid_state==1 && hasAuthoritys.indexOf('101002004000003') > -1"
                           @click="stateSwitching(scope.row)">停用
                </el-button>
                <el-button style="margin-left: 6px" type="text" size="small"
                           v-if="scope.row.valid_state==0 && hasAuthoritys.indexOf('101002004000003') > -1"
                           @click="stateSwitching(scope.row)">启用
                </el-button>
                <el-button style="margin-left: 6px" type="text" size="small" @click="delPriceSystem(scope.row)"
                           v-if="scope.row.valid_state==0 && hasAuthoritys.indexOf('101002004000004') > -1">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pagination tzx-pagination-container" style="padding-right: 20px">
      <el-pagination
        background
        prev-text='上一页'
        next-text='下一页'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper, sizes"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import copyPriceManage from './children/copyPriceManage.vue'
  import editPriceManage from './children/editPriceManage.vue'
  import priceDetails from './children/priceDetails.vue'
  import priceStore from './children/priceStore.vue'
  export default {
    name: 'priceManage',
    props: [],
    data () {
      return {
        search: '',
        select: 'price_system_name',
        currentPage: 1,
        pageSize: 10,
        showPriceManage: false,
        showCopyPrice: false,
        showPriceDetails: false,
        showPriceStore: false,
        activeName: '',
        multipleSelection: {},
        brandList: [],
        index: 0,
        brand_id: '',
        dataList: [],
        num: 0,
        rowdata: {},
        total: 0,
        valid_state: '',
        sortName: '',
        sortOrder: '',
        selections: []
      }
    },
    computed: {
      multipleSelections: {
        get: function () {
          return this.multipleSelection
        },
        set: function () {
          this.reset(this)
        }
      },
      authority () {
        return this.$store.getters.getAuthority
      },
      hasAuthoritys () {
        let arr = []
        this.authority.forEach(item => {
          if (item.fatherModulId === '101002004') {
            arr.push(item.modulId)
          }
        })
        return arr
      }
    },
    components: {
      copyPriceManage,
      editPriceManage,
      priceDetails,
      priceStore
    },
    methods: {
      filterTag (value, row) {
        return row.valid_state === value
      },
      handleSizeChange (val) {
        this.pageSize = this.multipleSelections[this.activeName].pageSize = val
        this.getDataList()
      },
      handleCurrentChange (val) {
        this.currentPage = this.multipleSelections[this.activeName].currentPage = val
        this.getDataList()
      },
      copyData: function () {
        if (this.num === 0) {
          this.$message({type: 'error', message: '请选择要复制的条目'})
          return false
        } else {
          this.selections = this.multipleSelections[this.activeName].selection
          this.showCopyPrice = true
        }
      },
      closeCopyPriceManage: function () {
        this.multipleSelections[this.activeName].selection = this.selections = []
        this.$refs.multipleTable[this.index].clearSelection()
        this.showCopyPrice = false
      },
      addData: function (data) {
        this.rowdata = data
        this.showPriceManage = true
      },
      closeEditPriceManage: function (flag) {
        if (flag) {
          this.getDataList()
        }
        this.showPriceManage = false
      },
      checkData: function (row) {
        if (this.hasAuthoritys.indexOf('101002004000005') > -1) {
          this.rowdata = row
          this.showPriceDetails = true
        } else {
          this.$message({
            type: 'warning',
            message: '未获得查看权限'
          })
        }
      },
      closePriceDetails: function (...args) {
        this.showPriceDetails = false
        if (args.length > 0) {
          this.rowdata = args[1]
          this.showPriceManage = args[0]
        } else {
          this.rowdata = {}
        }
      },
      checkpriceList: function (row) {
        row.brand_id = this.brand_id
        this.rowdata = row
        this.showPriceStore = true
      },
      toList: function (...arg) {
        this.showPriceDetails = false
        this.rowdata = arg[1]
        this.showPriceStore = arg[0]
      },
      closePriceStore: function () {
        this.showPriceStore = false
        this.rowdata = {}
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable[this.index].toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable[this.index].clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelections[this.activeName].selection = val
        this.num = this.multipleSelections[this.activeName].selection.length
      },
      reset (self) {
        let obj = {}
        self.brandList.forEach(function (item) {
          obj[item.brandname] = {selection: [], currentPage: 1, pageSize: 10, id: item.id}
        })
        return (self.multipleSelection = obj)
      },
      handleTabClick (tab, event) {
        this.index = tab.index
        this.activeName = tab.name
        this.brand_id = tab.$vnode.key
        this.multipleSelections[tab.name].selection = []
        this.num = this.multipleSelections[tab.name].selection.length
        this.pageSize = this.multipleSelection[this.activeName].pageSize
        this.currentPage = this.multipleSelection[this.activeName].currentPage
        this.getDataList()
      },
      getDataList (callback) {
        const self = this
        this.$http.post('/api/organization/priceSystem/load', {
          pagination: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sort: this.sortName,
            order: this.sortOrder
          },
          form: {
            brand_id: this.brand_id,
            valid_state: this.valid_state,
            price_system_name: this.search
          }
        }).then(function (res) {
          if (res.data.code === '0') {
            if (self.brand_id === '') {
              self.brandList = res.data.data.brands
            }
            self.total = res.data.data.total
            self.dataList = res.data.data.priceSystems
            self.activeName = self.brandList[self.index].brandname
            self.brand_id = self.brandList[self.index]['id']
            if (callback) (callback(self))
          } else if (res.data.msg) {
            self.$message({type: 'error', message: res.data.msg})
          }
        }).catch(function (err) {
          if (err) {
            self.$message({type: 'error', message: err.msg})
          }
        })
      },
      DateFormatter (row, column, cellValue) {
        var d = new Date(cellValue)
        var year = d.getFullYear()
        var month = d.getMonth() - 0 + 1 < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
        var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
        return year + '-' + month + '-' + day
      },
      stateSwitching (row) {
        const self = this
        this.$http.post('/api/organization/priceSystem/stopOrStart', {
          id: row.id,
          validState: row.valid_state === '0' ? 1 : 0
        }).then(function (res) {
          if (res.data.code === '0') {
            self.getDataList()
            self.$message({
              type: 'success',
              message: row.valid_state === '0' ? '启用成功' : '停用成功'
            })
          } else if (res.data.msg) {
            self.$message({type: 'error', message: res.data.msg})
          }
        }).catch(function (err) {
          if (err) {
            self.$message({type: 'error', message: err.msg})
          }
        })
      },
      delPriceSystem (row) {
        const self = this
        self.$http.post('/api/organization/priceSystem/delPriceSystem', {
          id: row.id,
          brand_id: row.brand_id
        }).then(function (res) {
          if (res.data.code === '10') {
            self.$confirm('您确认要删除此职位？', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '执行中...'
                  self.$http.post('/api/organization/priceSystem/delPriceSystem', {
                    id: row.id,
                    brand_id: row.brand_id,
                    type: 'T'
                  }).then(function (res) {
                    done()
                    instance.confirmButtonLoading = false
                    self.$message({
                      message: '此价格体系已删除',
                      type: 'success',
                      duration: 2000
                    })
                    self.getDataList()
                  }).catch(function (err) {
                    if (err) {
                      self.$message({
                        message: err.msg,
                        type: 'error'
                      })
                    }
                    done()
                  })
                } else {
                  done()
                }
              }
            }).catch(() => {
              self.$message({
                message: '已取消删除',
                type: 'info',
                duration: 1000
              })
            })
          } else if (res.data.code === '11') {
            const h = self.$createElement
            self.$msgbox({
              title: '',
              confirmButtonText: '知道了',
              confirmButtonClass: 'saasbtn saasbtn-default',
              message: h('div', null, [
                h('p', null, '此价格体系被机构引用,不能删除！'),
                h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[0].org_full_name),
                h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[1] ? res.data.data[1].org_full_name : ''),
                h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data[2] ? res.data.data[2].org_full_name : ''),
                h('p', {style: 'text-align: center;margin-left: -34px;font-size: 14px;color: #758896;line-height: 20px;'}, res.data.data.length >= 3 ? '……' : '')
              ]),
              type: 'error',
              showClose: false
            }).catch(() => {
              self.$message({
                message: '已取消删除',
                type: 'info',
                duration: 1000
              })
            })
          }
        }).catch(function (err) {
          if (err) {
            self.$message({
              message: err.msg,
              type: 'error'
            })
          }
        })
      },
      stateChange (filters) {
        this.valid_state = filters.valid_state[0]
        this.getDataList()
      },
      sort (item) {
        this.sortName = item.prop
        if (item.order) {
          this.sortOrder = item.order.replace('ending', '')
        } else {
          this.sortOrder = ''
        }
        this.getDataList()
      }
    },
    created () {
      this.getDataList(this.reset)
    }
  }
</script>
<style type='text/less' lang='less'>
  #priceManage {
    .el-tabs.el-tabs--top {
      height: 100%;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      .el-tabs__header {
        width: 100%;
        height: 44px;
        margin: 0;
        .el-tabs__nav-wrap {
          margin: 0;
          .el-tabs__nav-scroll {
            .el-tabs__nav {
              height: 44px;
              .el-tabs__item {
                height: 44px;
                line-height: 44px;
                padding: 0 30px;
              }
              .el-tabs__item:nth-child(2) {
                padding-left: 10px;
              }
            }
          }
        }
      }
      .el-tabs__content {
        width: 100%;
        flex: 1;
        .el-tab-pane {
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          .el-table.el-table--fit.el-table--enable-row-transition {
            height: 100%;
          }
        }
      }
    }
  }
</style>
<style type='text/less' lang='less' scoped>
  @import "./priceManage.less";
</style>
